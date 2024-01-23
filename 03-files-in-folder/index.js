const fsPromises = require('node:fs/promises');
const path = require('node:path');
const { stat } = require('node:fs');

const dirPath = path.join(__dirname, '/secret-folder');

(async () => {
  try {
    const files = await fsPromises.readdir(dirPath, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(file.path, file.name);
      const fileFormat = path.extname(filePath);
      const fileName = path.basename(filePath, fileFormat);

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
