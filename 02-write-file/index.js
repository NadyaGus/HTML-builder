const fs = require('node:fs');
const path = require('node:path');
const filePath = path.join(__dirname, 'text.txt');

const readline = require('node:readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Hello! Do you want remember something? \n', (answer) => {
  if (answer === 'exit') {
    rl.close();
  } else {
    fs.writeFile(filePath, answer, (err) => {
      if (err) throw err;
    });
  }
});

const bye = () => console.log('Good-bye!');
rl.on('close', bye);
