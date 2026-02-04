# C Compiler Sandbox Solution

## Docker Image
**Image**: `gcc:13-alpine`
- **Why**: This is the Official GCC Docker image, using the Alpine Linux variant.
- **Size**: ~150MB (vs >1GB for standard GCC).
- **Security**: Runs as a non-root user `sandbox`.

## Directory Structure
- `/workspace`: Where user code is mounted.
- `/usr/local/bin/runner.sh`: The master control script.

## Usage

### 1. Build the Image
```bash
docker build -t c-compiler .
```

### 2. Run a C Program
Assuming your C code is in `$(pwd)/temp`:

```bash
docker run --rm -i \
  --network none \
  --memory 128m \
  --cpus 0.5 \
  -v "$(pwd)/temp:/workspace:rw" \
  c-compiler
```

### Security Features
- **Network Isolation**: `--network none` prevents outside access.
- **Resource Limits**: 128MB RAM, 0.5 CPU.
- **Time Limits**: `timeout 10s` inside the runner handling infinite loops.
- **User Isolation**: Runs as `sandbox` user, cannot modify system files.
