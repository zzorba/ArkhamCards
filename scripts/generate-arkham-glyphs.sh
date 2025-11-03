#!/bin/bash

# Generate TypeScript glyph mappings from arkhamslim.json and arkhamicons-config.json

ICONS_FILE="assets/arkhamicons-config.json"
OUTPUT_FILE="src/generated/arkhamGlyphs.ts"

echo "Generating arkham glyph mappings..."

# Extract icon names and codes using jq and generate TypeScript
cat > "$OUTPUT_FILE" <<EOF
// Auto-generated from arkhamslim.json and arkhamicons-config.json
// Run 'yarn generate:glyphs' to regenerate this file

export const ARKHAM_GLYPHS: Record<string, number> = {
EOF

# Use jq to extract name and code pairs from icons
jq -r '.icons[] | "  \"\(.properties.name)\": \(.properties.code),"' "$ICONS_FILE" >> "$OUTPUT_FILE"

# Remove trailing comma from last line and close the object
sed -i '' '$ s/,$//' "$OUTPUT_FILE"
echo "};" >> "$OUTPUT_FILE"

echo "Generated $OUTPUT_FILE"
