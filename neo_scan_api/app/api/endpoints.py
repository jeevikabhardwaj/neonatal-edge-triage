import io
import base64
import torch
import torch.nn.functional as F
from PIL import Image

from fastapi import APIRouter, UploadFile, File, HTTPException, status

# Import from local modules
from neo_scan_api.app.dependencies.model_loader import load_phase1_model_and_metadata
from neo_scan_api.preprocessing.image_transforms import preprocess_image_for_inference
from neo_scan_api.gradcam.grad_cam import GradCAM

router = APIRouter()

# Load the model and metadata once when the application starts
# This leverages the caching mechanism in model_loader.py
model, metadata = load_phase1_model_and_metadata()
model_device = next(model.parameters()).device
class_names = metadata.get("class_names", ["Normal", "Abnormal"])
target_layer = model.features[12] # Based on previous analysis

# Helper to convert heatmap tensor to base64 PNG
def heatmap_to_base64_png(heatmap_tensor: torch.Tensor) -> str:
    # Heatmap is [1, H, W], needs to be [H, W] for PIL
    heatmap_np = heatmap_tensor.squeeze(0).cpu().numpy()

    # Convert to 'L' mode PIL Image (grayscale) and scale to 0-255
    heatmap_pil = Image.fromarray((heatmap_np * 255).astype('uint8'), 'L')

    # Create a BytesIO object to save the image to memory
    img_byte_arr = io.BytesIO()
    heatmap_pil.save(img_byte_arr, format='PNG')
    encoded_img = base64.b64encode(img_byte_arr.getvalue()).decode('ascii')
    return encoded_img

@router.post("/predict")
async def predict_image(image: UploadFile = File(...)):
    gradcam_instance = None # Initialize outside try for finally block access
    try:
        # 1. Validate that an image was actually uploaded
        if not image.file:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No image file provided."
            )

        # 2. Read image content
        contents = await image.read()

        # 3. Open the uploaded image with PIL
        # 4. Convert it to RGB.
        try:
            pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not process image file. Ensure it is a valid image format."
            )

        # Basic image info
        original_width, original_height = pil_image.size

        # 5. Use the EXISTING preprocess_image_for_inference()
        processed_input_tensor = preprocess_image_for_inference(pil_image)

        # 6. Move the processed input tensor to the model's device.
        processed_input_tensor = processed_input_tensor.to(model_device)

        # 7. Perform initial inference using the existing model for probabilities
        #    and predicted class. This part can be inside torch.no_grad().
        model.eval() # Ensure model is in evaluation mode
        with torch.no_grad():
            outputs = model(processed_input_tensor)

        # 8. Calculate softmax probabilities.
        probabilities = F.softmax(outputs, dim=1).squeeze(0) # Squeeze batch dim for single image
        predicted_class_idx = torch.argmax(probabilities).item()

        normal_probability = probabilities[0].item()
        abnormal_probability = probabilities[1].item()

        # 9. Generate Grad-CAM outside torch.no_grad() to allow gradients.
        #    The GradCAM.generate method handles its own forward/backward.
        gradcam_instance = GradCAM(model, target_layer)
        heatmap, _, _ = gradcam_instance.generate(processed_input_tensor)

        # 10. Convert the heatmap into a browser-friendly image representation
        gradcam_image_b64 = heatmap_to_base64_png(heatmap)

        # 11. Return the results
        return {
            "filename": image.filename,
            "content_type": image.content_type,
            "original_width": original_width,
            "original_height": original_height,
            "predicted_class_index": predicted_class_idx,
            "predicted_class_name": class_names[predicted_class_idx],
            "normal_probability": normal_probability,
            "abnormal_probability": abnormal_probability,
            "gradcam_image": gradcam_image_b64,
        }

    except HTTPException:
        raise # Re-raise FastAPI HTTPExceptions directly
    except Exception as e:
        # Do NOT expose raw Python exception messages.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred during prediction."
        )
    finally:
        # 12. Make sure Grad-CAM hooks are removed after generation, including when an error occurs.
        if gradcam_instance:
            gradcam_instance.remove_hooks()
