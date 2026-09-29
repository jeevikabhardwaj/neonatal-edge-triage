# Use a lightweight Python base image compatible with PyTorch
FROM python:3.10-slim-bookworm

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file specific to the backend service
# Ensure the path is correct from the Docker build context
COPY neonatal_edge_triage/neo_scan_api/requirements.txt /app/requirements.txt

# Install the Python dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the entire FastAPI application source code into the container
# This will create `/app/neo_scan_api/` inside the container, preserving the package structure.
COPY neonatal_edge_triage/neo_scan_api /app/neo_scan_api

# Expose the port that Uvicorn will listen on
EXPOSE 8000

# Command to run the FastAPI application using Uvicorn
# `neo_scan_api.app.main:app` references the FastAPI app instance within the `neo_scan_api` package.
# Setting PYTHONPATH ensures `neo_scan_api` is discoverable as a top-level package.
# --host 0.0.0.0 makes the server accessible from outside the container
# --port 8000 specifies the port
CMD ["sh", "-c", "PYTHONPATH=/app uvicorn neo_scan_api.app.main:app --host 0.0.0.0 --port 8000"]
