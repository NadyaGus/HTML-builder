const fs = require('node:fs');
const path = require('node:path');
const filePath = path.join(__dirname, 'text.txt');

const readline = require('node:readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Hello! Do you want remember something? ', (answer) => {
  fs.writeFile(filePath, answer, (err) => {
    if (err) throw err;
  });
  console.log(`Great! I remember ${answer} in ${filePath}.`);
  rl.close();
});
