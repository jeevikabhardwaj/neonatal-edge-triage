import torch
from torchvision import transforms
from PIL import Image

# ImageNet normalization parameters (same as used during training)
MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]

# Preprocessing transform for inference
# This transform exactly matches the validation/test preprocessing used during training.
# - Input image is converted to RGB.
# - Resized to 224x224.
# - Converted to PyTorch tensor.
# - ImageNet normalization applied.
INFERENCE_TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(MEAN, STD),
])

def preprocess_image_for_inference(pil_image: Image.Image) -> torch.Tensor:
    """
    Applies the defined inference preprocessing steps to a PIL Image
    and returns a preprocessed tensor suitable for model inference.

    Args:
        pil_image (PIL.Image.Image): The input image in PIL format.

    Returns:
        torch.Tensor: The preprocessed image tensor with shape [1, 3, 224, 224].
    """
    # Ensure the input image is in RGB format
    if pil_image.mode != 'RGB':
        pil_image = pil_image.convert('RGB')

    # Apply the inference transform
    processed_tensor = INFERENCE_TRANSFORM(pil_image)

    # Add the batch dimension to make the shape [1, 3, 224, 224] for model inference
    return processed_tensor.unsqueeze(0)
