const { readFile } = require('node:fs/promises');
const { constants } = require('node:fs');
const fsPromises = require('node:fs/promises');
const path = require('node:path');

const distPath = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');
const bundle = path.join(distPath, 'bundle.css');

(async () => {
  try {
    await fsPromises.access(bundle, constants.F_OK);
    await fsPromises.rm(bundle);
  } catch {
    await fsPromises.appendFile(bundle, '');
  }
})();

(async () => {
  try {
    const files = await fsPromises.readdir(stylesPath);
    const promises = [];

    for (const file of files) {
      const fileFormat = path.extname(file);
      const dataPath = path.join(stylesPath, file);

      if (fileFormat === '.css') {
        const content = await readFile(dataPath, { encoding: 'utf-8' });

        promises.push(fsPromises.appendFile(bundle, content));
      }
    }

    await Promise.all(promises);
  } catch (err) {
    console.error(err);
  }
})();
