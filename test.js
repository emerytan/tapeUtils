const spawn = require('child_process').spawn

const lines = spawn('wc', ['-l', './tmp/backup1_sums.md5', '|', 'cut', '-f1'], {
  stdio: 'inherit'
})

console.log(lines.stdout);

