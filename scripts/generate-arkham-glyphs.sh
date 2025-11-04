#!/bin/bash

# Generate TypeScript glyph mappings from arkhamslim.json and arkhamicons-config.json

# Check if required arguments are provided
if [ $# -ne 3 ]; then
    echo "Error: Missing required arguments"
    echo "Usage: $0 <icons-file> <output-file> <constant-name>"
    echo "Example: $0 assets/arkhamicons-config.json src/generated/arkhamGlyphs.ts ARKHAM_GLYPHS"
    exit 1
fi

ICONS_FILE="$1"
OUTPUT_FILE="$2"
CONSTANT_NAME="$3"

# Validate that the icons file exists
if [ ! -f "$ICONS_FILE" ]; then
    echo "Error: Icons file not found: $ICONS_FILE"
    exit 1
fi

echo "Generating arkham glyph mappings..."

# Extract icon names and codes using jq and generate TypeScript
cat > "$OUTPUT_FILE" <<EOF
// Auto-generated from arkhamslim.json and arkhamicons-config.json
// Run 'yarn generate:glyphs' to regenerate this file

export const ${CONSTANT_NAME}: Record<string, number> = {
EOF

# Use jq to extract name and code pairs from icons
jq -r '.icons[] | "  \"\(.properties.name)\": \(.properties.code),"' "$ICONS_FILE" >> "$OUTPUT_FILE"

# replace all " with ' in this file
sed -i '' "s/\"/'/g" "$OUTPUT_FILE"
# close the object
echo "};" >> "$OUTPUT_FILE"

echo "Generated $OUTPUT_FILE"
