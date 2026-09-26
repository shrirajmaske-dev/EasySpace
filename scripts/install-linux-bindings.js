import { execSync } from 'child_process';
import os from 'os';

// When running on Linux CI/CD (such as Vercel), ensure Linux native binaries for Rolldown and LightningCSS exist
if (os.platform() === 'linux') {
  console.log('Detected Linux environment on Vercel. Ensuring Linux native bindings are installed...');
  try {
    execSync('npm install --no-save --prefix client @rolldown/binding-linux-x64-gnu lightningcss-linux-x64-gnu', {
      stdio: 'inherit',
    });
    execSync('npm install --no-save @rolldown/binding-linux-x64-gnu lightningcss-linux-x64-gnu', {
      stdio: 'inherit',
    });
    console.log('✓ Successfully installed Linux native bindings for Rolldown & LightningCSS.');
  } catch (err) {
    console.warn('[Binding Install Warning]:', err.message);
  }
} else {
  console.log(`Platform is ${os.platform()} (non-linux). Skipping Linux native binding installation.`);
}
