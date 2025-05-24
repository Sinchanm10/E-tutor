const { spawn } = require('child_process');
const path = require('path');

// Path to app.py
const pythonScript = path.join(__dirname, 'app.py');

// Spawn the Python process
const pythonProcess = spawn('python', [pythonScript]);

// Log output from the Python process
pythonProcess.stdout.on('data', (data) => {
  console.log(`Flask Output: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
  console.error(`Flask Error: ${data}`);
});

pythonProcess.on('close', (code) => {
  console.log(`Flask process exited with code ${code}`);
});
