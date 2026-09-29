import torch
import torch.nn as nn
from torchvision.models import mobilenet_v3_small, MobileNet_V3_Small_Weights

# Define class names for the binary classification task
CLASS_NAMES = ["Normal", "Abnormal"]

def build_phase1_model(num_classes: int = 2) -> nn.Module:
    """
    Builds the MobileNetV3-Small architecture as used in NeoScan AI Phase 1 training.
    The model is initialized with ImageNet pre-trained weights, and its final
    classifier layer is replaced to output `num_classes`.

    Args:
        num_classes (int): The number of output classes for the classifier.

    Returns:
        nn.Module: The configured MobileNetV3-Small model.
    """
    # Load MobileNetV3-Small with default ImageNet pre-trained weights
    # MobileNet_V3_Small_Weights.DEFAULT refers to ImageNet1K_V1
    model = mobilenet_v3_small(weights=MobileNet_V3_Small_Weights.DEFAULT)

    # Replace the final classifier layer to match the number of output classes
    # The original classifier is an nn.Sequential object, and the last layer (index 3)
    # is the nn.Linear layer that needs modification.
    in_features_last_layer = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features_last_layer, num_classes)

    return model

def load_model_weights(model: nn.Module, state_dict: dict, device: torch.device) -> nn.Module:
    """
    Loads a state dictionary into the model and sets the model to evaluation mode.

    Args:
        model (nn.Module): The PyTorch model instance.
        state_dict (dict): The state dictionary containing the model weights.
        device (torch.device): The device (e.g., 'cpu' or 'cuda') to which the model should be moved.

    Returns:
        nn.Module: The model with loaded weights and set to evaluation mode.
    """
    model.load_state_dict(state_dict)
    model.to(device)
    model.eval()  # Set the model to evaluation mode
    return model
