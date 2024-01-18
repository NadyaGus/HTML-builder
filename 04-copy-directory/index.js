const fsPromises = require('node:fs/promises');
const path = require('node:path');

(async () => {
  try {
    const dirPath = path.join(__dirname, 'files');
    await fsPromises.mkdir(
      path.join(__dirname, 'files-copy'),
      { recursive: true },
      (err) => {
        if (err) {
          return console.error(err);
        }
      },
    );

    const files = await fsPromises.readdir(dirPath);

    for (const file of files) {
      const src = path.join(dirPath, `${file}`);
      const dest = path.join(dirPath + '-copy', `${file}`);

      fsPromises.copyFile(src, dest);
    }
  } catch (err) {
    console.error(err);
  }
})();
