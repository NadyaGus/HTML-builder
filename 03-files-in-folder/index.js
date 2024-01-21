const fsPromises = require('node:fs/promises');
const path = require('node:path');
const { stat } = require('node:fs');

const dirPath = path.join(__dirname, '/secret-folder');

(async () => {
  try {
    const files = await fsPromises.readdir(dirPath, { withFileTypes: true });

    for (const file of files) {
      const fileName = file.name.slice(0, file.name.indexOf('.'));
      const fileFormat = path.extname(file.name);
      const filePath = path.join(dirPath, fileName + fileFormat);

      if (file.isFile()) {
        stat(filePath, (err, stats) => {
          const size = stats.size;
          console.log(
            `${fileName}` +
              ' - ' +
              `${fileFormat.slice(1)}` +
              ' - ' +
              `${size} bytes`,
          );
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
