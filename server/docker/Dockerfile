FROM ubuntu:22.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update and install required languages and tools
RUN apt-get update && apt-get install -y \
    python3 \
    gcc \
    g++ \
    openjdk-17-jdk \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user 'sandbox' for safety
RUN useradd -m -s /bin/bash sandbox

# Set working directory
WORKDIR /app

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Switch to non-root user
USER sandbox

# Entrypoint to handle execution
ENTRYPOINT ["/entrypoint.sh"]
