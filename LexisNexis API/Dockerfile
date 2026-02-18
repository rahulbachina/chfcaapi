FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for XML processing
RUN apt-get update && apt-get install -y \
    libxml2-dev \
    libxslt-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY app/ ./app/
COPY .env .env

# Expose port
EXPOSE 8001

# Run application
CMD ["python", "-m", "app.main"]
