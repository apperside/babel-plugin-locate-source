npm run build
npm version patch
cp package.json dist/package.json
cp README.md dist/README.md
cp debug-styles.css dist/debug-styles.css
cp DEBUGGING.md dist/DEBUGGING.md
cp "DEV TOOLS.md" "dist/DEV 3TOOLS.md"
cd dist
npm publish