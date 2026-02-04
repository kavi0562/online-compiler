#!/bin/sh

# 1. Directory Setup
cd /workspace || exit 1

# 2. File Detection
# Check if any .c files exist
set -- *.c
if [ "$1" = "*.c" ]; then
  echo "❌ Error: No .c files found. Please submit at least one Source file."
  exit 1
fi

# 3. Compilation
# -lm  : Explicitly link the math library (vital for math.h)
# -Wall: Enable warning messages (helpful for debugging)
# -o app: Output executable name
# 2>   : Redirect compilation errors to a file
gcc -O2 -Wall *.c -o app -lm 2> compile_log.txt

# Check if compilation failed
if [ $? -ne 0 ]; then
  echo "❌ Compilation Failed:"
  cat compile_log.txt
  exit 1
fi

# 4. Execution
if [ -f "./app" ]; then
    # Execute the binary
    # We use 'timeout' to prevent infinite loops eating resources.
    # 10s is a generous limit for simple online problems.
    # $@ allows passing args if needed, though usually stdin is used.
    
    timeout 10s ./app
    EXIT_CODE=$?

    # 5. Runtime Error Handling
    if [ $EXIT_CODE -ne 0 ]; then
        if [ $EXIT_CODE -eq 124 ]; then
            echo "\n⏱️ Runtime Error: Execution timed out (Possible infinite loop)"
        elif [ $EXIT_CODE -eq 139 ]; then
            echo "\n💥 Runtime Error: Segmentation Fault (SIGSEGV) - Invalid memory access"
        elif [ $EXIT_CODE -eq 136 ]; then
            echo "\n➗ Runtime Error: Floating Point Exception (SIGFPE) - Divide by zero?"
        else
            echo "\n❌ Program exited with non-zero status: $EXIT_CODE"
        fi
        exit $EXIT_CODE
    fi
else
    echo "❌ System Error: Executable not found after successful compilation."
    exit 1
fi
