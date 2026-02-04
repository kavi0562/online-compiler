# Production-Ready Java Sandbox Design

This document outlines the complete solution for your Online Java Compiler. The solution uses a dedicated, lightweight Docker image to compile and run any valid Java program automatically.

## 1. Docker Image Choice
We selected **`eclipse-temurin:21-jdk-alpine`**.
- **Official & Maintained**: Eclipse Temurin is the standard production build of OpenJDK.
- **Lightweight**: The Alpine Linux base keeps the image small (~180MB) and fast to boot.
- **Secure**: Minimal attack surface with no unnecessary system packages.
- **Modern**: Supports Java 21 LTS features.

## 2. Core Components
We have created the following files in your project directories:

### A. Dockerfile (`server/docker/java/Dockerfile`)
This file defines the sandbox environment.
- Creates a secure non-root user (`sandbox`).
- Sets up the workspace.
- Copies the intelligent runner script.

### B. Universal Runner Script (`server/docker/java/runner.sh`)
This is the brain of the compiler. It solves the "Any Class Name" constraint:
1.  **Compiles All Files**: Runs `javac *.java` on everything in the mounted folder.
2.  **Auto-Detects Main**: Uses `javap` to inspect compiled bytecode and find the class containing `public static void main`.
3.  **Executes**: Runs that class automatically.

## 3. How to Build
Run this command from your project root to build the image:

```bash
docker build -t java-sandbox ./server/docker/java
```

## 4. Execution Command
To run user code securely, use the following `docker run` command strategies.

### The Command
```bash
docker run \
  --rm \
  --name "java_job_<UNIQUE_ID>" \
  --network none \
  --memory 256m \
  --cpus 0.5 \
  --volume "/path/to/host/temp/folder:/workspace:rw" \
  java-sandbox
```

### Explanation of Flags
- `--rm`: Automatically remove the container after it stops. Keeps your server clean.
- `--network none`: **CRITICAL**. Prevents the code from accessing the internet (fetching malware, attacking local network).
- `--memory 256m`: Caps RAM usage. If code leaks memory, it crashes inside the container, not your server.
- `--cpus 0.5`: Limits CPU usage to 50% of one core. Prevents infinite loops from freezing the host.
- `--volume ...`: Mounts the temporary folder containing the user's `.java` files into the container's `/workspace`.

## 5. Integration Handling

### File Structure Strategy
For each user request:
1.  **Create Temp Dir**: Generate a unique folder (e.g., `/tmp/compiler/job-123`).
2.  **Write Code**: Save the user's code files into this folder.
    - If user gave one large text block, save it as `Main.java` (or try to parse class name).
    - If user gave multiple files, save them with their respective filenames.
3.  **Run Docker**: Execute the command above pointing to this folder.
4.  **Capture Output**: Read `stdout` and `stderr` from the Docker process.
5.  **Cleanup**: Delete the contents of `/tmp/compiler/job-123` after execution.

### Security Guarantees
- **Infinite Loops**: Handled by `--cpus` and the `timeout` feature in your backend (Node.js `child_process.exec` has a `timeout` option).
- **Fork Bombs**: Docker `pids-limit` (optional flag `--pids-limit 64`) can prevent fork bombs.
- **Filesystem Access**: The container is isolated. The user can only write to `/workspace` (which is the temp folder).

## 6. Edge Case Handling
- **No Main Method**: The runner script prints a clear "Runtime Error: Main method not found."
- **Compilation Errors**: `javac` output is printed directly to the user.
- **Multiple Main Methods**: The script picks the *first* one it finds. (Robust default).
- **Package Declarations**: If user code has `package com.example;`, it requires a folder structure to run `java com.example.Main`.
    - *Limitation*: Standard simple online compilers often ask users to remove package declarations or handle standard directory structures.
    - *Handling*: Our runner works for the default package (no package). If they use packages, `javac` works, but `java` execution might fail if directories aren't perfect. For a "Simple Run" button, it's best to strip `package` lines or advise users against them.
