# 1. Use Alpine Linux (Standard for minimal images)
# Official 'gcc' repo does not have Alpine tags.
# We use the official Alpine image and install GCC.
FROM alpine:latest

# Install GCC, Libc, and Build Tools
RUN apk add --no-cache build-base

# 2. Security: Create a non-root user/group
# Creating a system user 'sandbox' for isolation
RUN addgroup -S sandbox && adduser -S sandbox -G sandbox

# 3. Setup environment
# Create a dedicated workspace directory
WORKDIR /workspace

# 4. Copy the runner script
# This script handles compilation and execution logic
COPY runner.sh /usr/local/bin/runner.sh
RUN chmod +x /usr/local/bin/runner.sh

# 5. Security: Enforce Non-Root User
# Prevents the container from having root privileges
USER sandbox

# 6. Entrypoint
ENTRYPOINT ["/usr/local/bin/runner.sh"]
