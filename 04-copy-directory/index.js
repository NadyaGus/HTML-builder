const fsPromises = require('node:fs/promises');
const path = require('node:path');
const { constants } = require('node:fs');

const dirPath = path.join(__dirname, 'files');

(async () => {
  try {
    const copyDirPath = path.join(__dirname, 'files-copy');
    await fsPromises.access(copyDirPath, constants.F_OK);
    await fsPromises.rm(copyDirPath, { recursive: true });
    await makeDir();
    copyFiles();
  } catch {
    await makeDir();
    copyFiles();
  }
})();

const makeDir = async () => {
  fsPromises.mkdir(path.join(__dirname, 'files-copy'), {
    recursive: true,
  });
};

const copyFiles = async () => {
  try {
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
};
