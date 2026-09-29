# NeoScan AI – Phase 1 API

## Overview
This repository contains the backend for the NeoScan AI Phase 1 API, an AI-assisted research and triage prototype designed for the binary classification of Lung Ultrasound (LUS) images. It classifies images into "Normal" and "Abnormal" categories and provides explainability through Grad-CAM visualizations. It is important to note that this system is a prototype and not a clinically validated diagnostic tool, and it should not be used to claim clinical diagnoses of neonatal Respiratory Distress Syndrome (RDS).

## Features
- **Binary Classification:** Classifies Lung Ultrasound images as Normal or Abnormal.
- **Grad-CAM Visualization:** Generates visual heatmaps to highlight regions of interest in the input image that influenced the model's prediction.
- **FastAPI Backend:** Provides a robust and scalable API for serving the model.

## Model
- **Architecture:** MobileNetV3-Small.
- **Pretrained Weights:** Initialized with ImageNet pretrained weights.
- **Fine-tuning:** The model was fine-tuned for a 2-class (Normal/Abnormal) classification task.
- **Training Data Note:** Phase 1 was trained using a public adult POCUS lung ultrasound dataset with synthetic neonatal-domain adaptations. Synthetic transformations were applied only to the training set; validation and test images remained original and unmodified.

## Input Preprocessing
Incoming images are subjected to the following preprocessing steps before inference:
1.  **Resize:** Images are resized to 224x224 pixels.
2.  **RGB Conversion:** Images are converted to RGB format.
3.  **Normalization:** Image pixel values are normalized using ImageNet's mean and standard deviation.

## API Endpoints
-   **`GET /`**
    -   **Description:** Root endpoint of the API.
    -   **Response:** A welcome message indicating the API is running.

-   **`GET /health`**
    -   **Description:** Health check endpoint to verify the API's operational status.
    -   **Response:** Status of the API (e.g., `{"status": "ok", "message": "API is healthy"}`).

-   **`POST /predict`**
    -   **Description:** Accepts an LUS image for binary classification and Grad-CAM visualization.
    -   **Request:** `multipart/form-data` with an `image` file.

## Response Fields for `/predict`
The `/predict` endpoint returns a JSON object with the following fields:
-   **`filename`**: The original filename of the uploaded image.
-   **`content_type`**: The MIME type of the uploaded image.
-   **`original_width`**: The width of the original uploaded image in pixels.
-   **`original_height`**: The height of the original uploaded image in pixels.
-   **`predicted_class_index`**: The predicted class index (0 for Normal, 1 for Abnormal).
-   **`predicted_class_name`**: The human-readable predicted class name ("Normal" or "Abnormal").
-   **`normal_probability`**: The model's predicted probability for the "Normal" class.
-   **`abnormal_probability`**: The model's predicted probability for the "Abnormal" class.
-   **`gradcam_image`**: A base64 encoded PNG of the Grad-CAM heatmap.

## Running Locally
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jeevikabhardwaj/neonatal-edge-triage.git
    cd neonatal-edge-triage
    ```
2.  **Install dependencies:**
    ```bash
    pip install -r neo_scan_api/requirements.txt
    ```
3.  **Run the FastAPI application with Uvicorn:**
    ```bash
    PYTHONPATH=. uvicorn neo_scan_api.app.main:app --host 0.0.0.0 --port 8000 --reload
    ```
    The API will be accessible at `http://127.0.0.1:8000`.

## Docker Usage
To build and run the API using Docker:
1.  **Navigate to the `neonatal-edge-triage` directory:**
    ```bash
    cd neonatal-edge-triage
    ```
2.  **Build the Docker image:**
    ```bash
    docker build -f neo_scan_api/Dockerfile -t neoscan-phase1-api .
    ```
3.  **Run the Docker container:**
    ```bash
    docker run -p 8000:8000 neoscan-phase1-api
    ```
    The API will be accessible via port 8000 on your host machine.

## Model Download/Source
The MobileNetV3-Small model weights (`neoscan_phase1_best.pth`) are loaded at runtime from a public Hugging Face repository:
-   **Repository ID:** `jeevikabhardwaj/neoscan-phase1`
-   **Checkpoint Filename:** `neoscan_phase1_best.pth`

## Limitations
-   **Research Prototype:** This system is an AI-assisted research and triage prototype, not a clinically validated diagnostic system.
-   **No Clinical Diagnosis:** The model outputs should not be interpreted as definitive clinical diagnoses for neonatal Respiratory Distress Syndrome (RDS).
-   **Training Data Specifics:** While aiming for neonatal applications, Phase 1 was trained using a public adult POCUS lung ultrasound dataset, augmented with synthetic neonatal-domain adaptations. Validation and test images used for evaluation remained original and were not synthetically transformed.
