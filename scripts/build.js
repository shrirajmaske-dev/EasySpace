import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('client/dist');
const destDir = path.resolve('dist');

if (fs.existsSync(srcDir)) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.cpSync(srcDir, destDir, { recursive: true });
  console.log('✓ Successfully prepared distribution bundle in dist/ for Vercel deployment');
} else {
  console.error('✗ Build artifact client/dist was not found!');
  process.exit(1);
}
