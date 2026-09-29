import torch
import torch.nn as nn
from huggingface_hub import hf_hub_download

# Corrected: Absolute import from the models module, assuming neo_scan_api is the package root
from neo_scan_api.models.phase1_classifier.model import build_phase1_model, load_model_weights, CLASS_NAMES

# --- Configuration Constants ---
HF_REPO_ID = "jeevikabhardwaj/neoscan-phase1"
CHECKPOINT_FILENAME = "neoscan_phase1_best.pth"

# --- Device Setup ---
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# --- Caching Mechanism ---
# This will store the loaded model and metadata to prevent repeated downloads/loads.
_cached_model_data = None

def load_phase1_model_and_metadata():
    """
    Loads the NeoScan Phase 1 model and its associated metadata from Hugging Face.
    The model is loaded only once and then cached.

    Returns:
        tuple: A tuple containing:
            - nn.Module: The loaded PyTorch model in evaluation mode.
            - dict: A dictionary with relevant metadata (class_names, image_size, mean, std).
    """
    global _cached_model_data

    if _cached_model_data is not None:
        print("Using cached Phase 1 model and metadata.")
        return _cached_model_data

    print(f"Downloading checkpoint from Hugging Face: {HF_REPO_ID}/{CHECKPOINT_FILENAME}")
    # Download the checkpoint. For public repos, no token is required.
    # cache_dir can be specified if you want to control where it's stored.
    checkpoint_path = hf_hub_download(
        repo_id=HF_REPO_ID,
        filename=CHECKPOINT_FILENAME,
        token=None # Explicitly set to None for public access
    )

    print(f"Loading checkpoint from: {checkpoint_path}")
    # Load the checkpoint dictionary
    # weights_only=True is used because the checkpoint contains a state_dict
    # plus ordinary Python metadata (strings, lists, integers, and floats),
    # which makes it safer. This assumes the checkpoint is trusted.
    checkpoint = torch.load(
        checkpoint_path,
        map_location=device,
        weights_only=True # Changed from False to True as per user's request.
    )

    print("Building model architecture...")
    # Build the model architecture (number of classes is hardcoded to 2 for Phase 1)
    model = build_phase1_model(num_classes=2) # Phase 1 is a binary classifier

    print("Loading model weights...")
    # Load the state_dict into the model
    model = load_model_weights(model, checkpoint["model_state_dict"], device)

    # Extract relevant metadata
    metadata = {
        "class_names": checkpoint.get("class_names", CLASS_NAMES), # Use CLASS_NAMES as fallback
        "image_size": checkpoint.get("image_size"),
        "mean": checkpoint.get("mean"),
        "std": checkpoint.get("std"),
        "model_name": checkpoint.get("model_name"),
        "num_classes": checkpoint.get("num_classes"),
        "best_epoch": checkpoint.get("best_epoch"),
        "best_validation_loss": checkpoint.get("best_validation_loss"),
    }

    print("✅ Phase 1 model and metadata loaded successfully and cached.")
    _cached_model_data = (model, metadata)
    return _cached_model_data
