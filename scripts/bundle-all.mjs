import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist', 'lightcrush');
const resPath = path.join(distDir, 'resources.neu');

if (!fs.existsSync(resPath)) {
  console.error("resources.neu not found!");
  process.exit(1);
}

const resources = fs.readFileSync(resPath);
const files = fs.readdirSync(distDir);

for (const file of files) {
  // Skip the resource file itself, and don't process already bundled files
  if (file === 'resources.neu' || file.includes('standalone')) continue;
  
  const binPath = path.join(distDir, file);
  
  // Skip directories if any
  if (fs.statSync(binPath).isDirectory()) continue;

  const isWin = file.endsWith('.exe');
  
  // Create a clean output name, e.g., lightcrush-mac_x64-standalone
  let outName = file.replace('.exe', '');
  outName = `${outName}-standalone${isWin ? '.exe' : ''}`;
  
  const outPath = path.join(distDir, outName);
  
  const binData = fs.readFileSync(binPath);
  
  // Concatenate binary + resources.neu
  const combined = Buffer.concat([binData, resources]);
  
  fs.writeFileSync(outPath, combined);
  
  // Ensure the file is executable (helpful if transferred to Mac/Linux)
  try {
    fs.chmodSync(outPath, 0o755);
  } catch(e) {}
  
  console.log(`Created standalone binary: ${outName}`);
  
  // Clean up the original separated binary
  fs.unlinkSync(binPath);
}

// Clean up the resources.neu file as it is now embedded in all executables
fs.unlinkSync(resPath);

console.log("Successfully bundled all OS binaries into single standalone files!");
