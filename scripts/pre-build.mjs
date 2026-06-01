import fs from 'fs';

if (fs.existsSync('.gitignore')) {
  fs.renameSync('.gitignore', '.gitignore.backup');
  console.log('Temporarily renamed .gitignore to avoid Neutralino build exclusion.');
}
