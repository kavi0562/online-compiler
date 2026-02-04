#!/bin/bash

LANG=$1
shift

case $LANG in
  python|python3)
    timeout 3 python3 -u "$@"
    ;;
  c)
    gcc "$@" -o program && timeout 3 ./program
    ;;
  cpp)
    g++ "$@" -o program && timeout 3 ./program
    ;;
  java)
    javac "$@" && timeout 3 java Main
    ;;
  js|node|javascript)
    timeout 3 node "$@"
    ;;
  *)
    echo "Unsupported language: $LANG"
    ;;
esac
