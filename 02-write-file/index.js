const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const os = require('node:os');
const { stdout } = require('node:process');

const filePath = path.join(__dirname, 'text.txt');

const output = fs.createWriteStream(filePath);
const rl = readline.createInterface({
  input: process.stdin,
  output: output,
});

stdout.write(`Hello! Do you want remember something?${os.EOL}`, () => {
  rl.on('line', (answer) => {
    if (answer === 'exit') {
      bye();
    } else {
      output.write(`${answer}${os.EOL}`);
    }
  });
});

const bye = () => {
  console.log('Goodbye!');
  rl.close();
};

process.on('SIGINT', bye);
