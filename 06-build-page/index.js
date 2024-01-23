const { readFile, constants } = require('node:fs/promises');
const fsPromises = require('node:fs/promises');
const path = require('node:path');

const distPath = path.join(__dirname, 'project-dist');
const assetsPath = path.join(__dirname, 'assets');
const distAssetsPath = path.join(distPath, 'assets');

const createDistDir = async () => {
  try {
    await fsPromises.access(distPath, constants.F_OK);
    await fsPromises.rm(distPath, { recursive: true });
    await fsPromises.mkdir(distPath);
  } catch {
    await fsPromises.mkdir(distPath);
  }
};

const createIndexAndStyle = async () => {
  const indexPath = path.join(__dirname, 'project-dist', 'index.html');
  const stylePath = path.join(__dirname, 'project-dist', 'style.css');

  Promise.all([
    fsPromises.appendFile(indexPath, ''),
    fsPromises.appendFile(stylePath, ''),
  ]);
};

const addAssets = async () => {
  await fsPromises.mkdir(distAssetsPath);
  await fillAssets();
};

const fillAssets = async () => {
  try {
    const assets = await fsPromises.readdir(assetsPath, {
      withFileTypes: true,
    });

    const createDirPromises = [];
    const copyFilesPromises = [];

    for (const dir of assets) {
      if (dir.isDirectory()) {
        const dirPath = path.join(assetsPath, dir.name);
        const distDirPath = path.join(distAssetsPath, dir.name);

        createDirPromises.push(fsPromises.mkdir(distDirPath));

        const filesInDir = await fsPromises.readdir(dirPath);

        for (const file of filesInDir) {
          const src = path.join(dirPath, file);
          const dest = path.join(distDirPath, file);

          copyFilesPromises.push(fsPromises.copyFile(src, dest));
        }
      }
    }

    await Promise.all(createDirPromises);
    Promise.all(copyFilesPromises);
  } catch (err) {
    console.error(err);
  }
};

const fillHtml = async () => {
  const htmlPath = path.join(__dirname, 'template.html');
  const distHtmlPath = path.join(distPath, 'index.html');

  let content = await readFile(htmlPath, { encoding: 'utf-8' });

  const componentsPath = path.join(__dirname, 'components');
  const components = await fsPromises.readdir(componentsPath);

  for (const component of components) {
    const componentPath = path.join(componentsPath, component);
    const contentOfComponent = await readFile(componentPath, {
      encoding: 'utf-8',
    });

    const componentName = component.slice(0, component.indexOf('.'));
    content = content.replace(`{{${componentName}}}`, contentOfComponent);
  }

  await fsPromises.appendFile(distHtmlPath, content);
};

const fillCss = async () => {
  const cssPathDir = path.join(__dirname, 'styles');
  const distCssPath = path.join(distPath, 'style.css');

  const promises = [];

  const styles = await fsPromises.readdir(cssPathDir);

  for (const style of styles) {
    const stylePath = path.join(cssPathDir, style);
    const content = await readFile(stylePath, { encoding: 'utf-8' });

    promises.push(fsPromises.appendFile(distCssPath, content));
  }

  Promise.all(promises);
};

(async () => {
  try {
    await createDistDir();
    await createIndexAndStyle();
    await Promise.all([addAssets(), fillHtml(), fillCss()]);
  } catch (err) {
    console.log(err);
  }
})();
