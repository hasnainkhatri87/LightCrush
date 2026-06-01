import fs from 'fs';

if (fs.existsSync('.gitignore.backup')) {
  fs.renameSync('.gitignore.backup', '.gitignore');
  console.log('Restored .gitignore.');
}
