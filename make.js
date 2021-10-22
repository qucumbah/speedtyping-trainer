const fs = require('fs');
const cp = require('child_process');

if (fs.existsSync('./build')) {
  fs.rmSync('./build', { recursive: true });
}

fs.cpSync('public', 'build', { recursive: true });
cp.execSync('tsc', { stdio: 'inherit' });
