#!/bin/bash

# Script to copy exported database files to assets/generated for bundling
# Usage: ./scripts/copy-bundled-db.sh "file:///path/to/database"

set -e

if [ -z "$1" ]; then
  echo "Error: Please provide the database path from console logs"
  echo "Usage: ./scripts/copy-bundled-db.sh \"file:///path/to/database\""
  exit 1
fi

# Strip "file://" prefix from the path
DB_PATH="${1#file://}"

# Get the directory containing the database
DB_DIR=$(dirname "$DB_PATH")

# Derive metadata path (should be in Documents directory, up a few levels)
CONTAINER_DIR=$(echo "$DB_DIR" | sed 's|/Library/default||')
METADATA_JSON_PATH="$CONTAINER_DIR/Documents/arkham4.metadata.txt"

echo "Database path: $DB_PATH"
echo "Metadata path: $METADATA_JSON_PATH"

# Check if files exist
if [ ! -f "$DB_PATH" ]; then
  echo "Error: Database file not found at $DB_PATH"
  exit 1
fi

if [ ! -f "$METADATA_JSON_PATH" ]; then
  echo "Error: Metadata file not found at $METADATA_JSON_PATH"
  exit 1
fi

# Get script directory and project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$PROJECT_ROOT/assets/generated"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Copy files
echo "Copying database..."
cp "$DB_PATH" "$OUTPUT_DIR/arkham4.db"

echo "Copying metadata..."
cp "$METADATA_JSON_PATH" "$OUTPUT_DIR/arkham4.metadata.txt"

# Show file sizes
DB_SIZE=$(du -h "$OUTPUT_DIR/arkham4.db" | cut -f1)
echo ""
echo "✅ Success!"
echo "Database: $OUTPUT_DIR/arkham4.db ($DB_SIZE)"
echo "Metadata: $OUTPUT_DIR/arkham4.metadata.txt"
echo ""
echo "Next steps:"
echo "1. Rebuild your app to include the bundled database"
echo "2. On first launch, the database will be copied automatically"

yarn prebuild --clean