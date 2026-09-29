FROM python:3.11-slim

# Install system dependencies (crucial for Tesseract OCR to work)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Command to run the application (Render injects the PORT environment variable dynamically)
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}
