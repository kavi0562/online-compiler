#!/bin/sh

cd /workspace || exit 1

# Check java files
set -- *.java
if [ "$1" = "*.java" ]; then
  echo "❌ No .java files found"
  exit 1
fi

# Compile
javac *.java 2> compile_error.txt
if [ $? -ne 0 ]; then
  echo "❌ Compilation Error:"
  cat compile_error.txt
  exit 1
fi

# Find file that contains main method
MAIN_FILE=""
for file in *.java; do
  if grep -q "public static void main" "$file"; then
    MAIN_FILE="$file"
    break
  fi
done

if [ -z "$MAIN_FILE" ]; then
  echo "❌ Main method not found"
  exit 1
fi

# Extract class name safely
MAIN_CLASS=$(basename "$MAIN_FILE" .java)

# Run
java "$MAIN_CLASS"
