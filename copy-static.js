const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, ".next", "static");
const destDir = path.join(__dirname, ".next", "standalone", ".next", "static");
const serverFile = path.join(__dirname, ".next", "standalone", "server.js");

// Ensure the destination directory exists
fs.mkdirSync(destDir, { recursive: true });

// Copy the static folder
fs.cpSync(srcDir, destDir, { recursive: true });

console.log("✅ Successfully copied 'static' folder to '.next/standalone/.next'");

// Update server.js
if (fs.existsSync(serverFile)) {
  let content = fs.readFileSync(serverFile, "utf8");
  const updatedContent = content.replace(
    /const hostname = process\.env\.HOSTNAME \|\| '0\.0\.0\.0'/,
    "const hostname = '0.0.0.0'"
  );

  if (content !== updatedContent) {
    fs.writeFileSync(serverFile, updatedContent, "utf8");
    console.log("✅ Successfully updated 'server.js'");
  } else {
    console.log("ℹ️ No changes needed in 'server.js'");
  }
} else {
  console.log("❌ 'server.js' not found!");
}
