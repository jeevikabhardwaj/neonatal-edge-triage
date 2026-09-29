import torch
import torch.nn as nn
import torch.nn.functional as F

class GradCAM:
    def __init__(self, model: nn.Module, target_layer: nn.Module):
        self.model = model
        self.target_layer = target_layer
        self.hooks = []
        self.activations_hook_output = None
        self.gradients_hook_output = None

        self._register_hooks()

    def _register_hooks(self):
        # Forward hook to capture activations
        def _capture_activations(module, input, output):
            self.activations_hook_output = output.detach()

        # Backward hook to capture gradients
        def _capture_gradients(module, grad_input, grad_output):
            self.gradients_hook_output = grad_output[0].detach()

        # Register the hooks
        self.hooks.append(self.target_layer.register_forward_hook(_capture_activations))
        self.hooks.append(self.target_layer.register_full_backward_hook(_capture_gradients))

    def remove_hooks(self):
        for hook in self.hooks:
            hook.remove()
        self.hooks = [] # Clear the list of hooks

    def generate(self, input_tensor: torch.Tensor, target_class: int = None) -> (torch.Tensor, int, torch.Tensor):
        self.model.eval() # Set model to evaluation mode
        self.model.zero_grad() # Clear gradients for all model parameters

        # Reset captured activations and gradients for the new inference
        self.activations_hook_output = None
        self.gradients_hook_output = None

        # Perform forward pass
        outputs = self.model(input_tensor)
        probs = F.softmax(outputs, dim=1)

        # Get predicted class (index of max probability for the first image in the batch)
        predicted_class_idx = torch.argmax(probs, dim=1).item()

        # Determine the class for which to generate the CAM
        cam_target_class = target_class if target_class is not None else predicted_class_idx

        # Create a one-hot vector for the target class to backpropagate
        one_hot_output = torch.zeros_like(outputs).to(input_tensor.device)
        one_hot_output[:, cam_target_class] = 1

        # Perform backward pass. This will trigger the backward hook on target_layer.
        # Gradients are computed with respect to the target class score.
        outputs.backward(gradient=one_hot_output, retain_graph=False)

        # Retrieve captured activations and gradients
        activations = self.activations_hook_output
        gradients = self.gradients_hook_output

        if activations is None or gradients is None:
            raise RuntimeError("Activations or gradients not captured. Ensure hooks are correctly registered and the target layer is part of the computation graph for the forward and backward pass.")

        # Compute Grad-CAM weights (alpha_k) using global average pooling of gradients
        # gradients shape: [batch_size, channels, height, width]
        # weights shape: [batch_size, channels, 1, 1]
        weights = torch.mean(gradients, dim=[2, 3], keepdim=True)

        # Compute the weighted activation map
        # activations shape: [batch_size, channels, H_activations, W_activations]
        # weighted_activations shape: [batch_size, channels, H_activations, W_activations]
        weighted_activations = weights * activations

        # Sum across the channel dimension to get the raw heatmap
        # heatmap shape: [batch_size, 1, H_activations, W_activations]
        heatmap = torch.sum(weighted_activations, dim=1, keepdim=True)

        # Apply ReLU to keep only positive contributions (important for Grad-CAM)
        heatmap = F.relu(heatmap)

        # Normalize the heatmap to [0, 1] per image in the batch
        # Compute min/max across spatial dimensions for each image independently
        heatmap_min = heatmap.min(dim=-1, keepdim=True)[0].min(dim=-2, keepdim=True)[0]
        heatmap_max = heatmap.max(dim=-1, keepdim=True)[0].max(dim=-2, keepdim=True)[0]

        denominator = heatmap_max - heatmap_min
        normalized_heatmap = torch.where(
            denominator > 0,
            (heatmap - heatmap_min) / denominator.clamp_min(1e-8),
            torch.zeros_like(heatmap)
        )

        # Resize the heatmap to the original input image spatial size
        input_h, input_w = input_tensor.shape[2:]
        final_heatmap = F.interpolate(
            normalized_heatmap,
            size=(input_h, input_w),
            mode='bilinear',
            align_corners=False # Recommended for newer PyTorch versions
        )

        # Return heatmap (batch, 1, H, W), predicted class index (int for batch=1), and probabilities (batch, num_classes)
        # Squeeze batch dimension for single image input as per request
        if input_tensor.shape[0] == 1:
            return final_heatmap.squeeze(0), predicted_class_idx, probs.squeeze(0)
        else:
            return final_heatmap, torch.argmax(probs, dim=1), probs