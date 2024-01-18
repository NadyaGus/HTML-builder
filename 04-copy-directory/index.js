const fsPromises = require('node:fs/promises');
const path = require('node:path');

(async () => {
  try {
    const dirPath = path.join(__dirname, 'files');
    await fsPromises.mkdir(path.join(__dirname, 'files-copy'), {
      recursive: true,
    });

    const files = await fsPromises.readdir(dirPath);
    const promises = [];

    for (const file of files) {
      const src = path.join(dirPath, `${file}`);
      const dest = path.join(dirPath + '-copy', `${file}`);

      promises.push(fsPromises.copyFile(src, dest));
    }

    await Promise.all(promises);
  } catch (err) {
    console.error(err);
  }
})();
