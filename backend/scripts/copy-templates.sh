#!/bin/bash

SRC_DIR="src/templates"
DEST_DIR="dist/templates"

if [ -d "$SRC_DIR" ]; then
  mkdir -p "$DEST_DIR"
  cp -r "$SRC_DIR"/* "$DEST_DIR"/
  echo "✓ Templates copied to dist/templates"
else
  echo "⚠ Templates directory not found, skipping copy"
fi

