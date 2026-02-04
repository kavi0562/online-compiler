FROM eclipse-temurin:21-jdk-alpine

# 1. Security: Create a non-root user/group
RUN addgroup -S sandbox && adduser -S sandbox -G sandbox

# 2. Setup environment
WORKDIR /workspace

# 3. Copy the runner script
COPY runner.sh /usr/local/bin/runner.sh
RUN chmod +x /usr/local/bin/runner.sh

# 4. Enforce User
USER sandbox

# 5. Entrypoint
ENTRYPOINT ["/usr/local/bin/runner.sh"]
