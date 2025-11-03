#!/bin/bash

# Generate TypeScript glyph mappings from arkham icon config JSON files
# Usage: ./generate-arkham-glyphs.sh <input_json> <output_ts> <export_name>

ICONS_FILE="${1:-assets/arkhamicons-config.json}"
OUTPUT_FILE="${2:-src/generated/arkhamGlyphs.ts}"
EXPORT_NAME="${3:-ARKHAM_GLYPHS}"

echo "Generating glyph mappings from $ICONS_FILE to $OUTPUT_FILE..."

# Extract icon names and codes using jq and generate TypeScript
cat > "$OUTPUT_FILE" <<EOF
// Auto-generated from $ICONS_FILE
// Run 'yarn generate:glyphs' to regenerate this file

export const $EXPORT_NAME: Record<string, number> = {
EOF

# Use jq to extract name and code pairs from icons
jq -r '.icons[] | "  \"\(.properties.name)\": \(.properties.code),"' "$ICONS_FILE" >> "$OUTPUT_FILE"

# Remove trailing comma from last line and close the object
sed -i '' '$ s/,$//' "$OUTPUT_FILE"
echo "};" >> "$OUTPUT_FILE"

echo "Generated $OUTPUT_FILE"
