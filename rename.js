/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const name = process.argv[2];

if (!name) {
  console.error('You need to pass name `yarn rename new-package-name` or `node rename new-package-name`');
}

const packageFile = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageFile));

packageJson.name = packageJson.name.replace('XXX', name);
packageJson.description = packageJson.description.replace('XXX', name);
packageJson.repository.url = packageJson.repository.url.replace('XXX', name);
packageJson.bugs.url = packageJson.bugs.url.replace('XXX', name);
packageJson.homepage = packageJson.homepage.replace('XXX', name);
packageJson.private = false;

const packageJsonNewContent = JSON.stringify(packageJson, null, 2);

if (!process.env.DRY) {
  fs.writeFileSync(packageFile, packageJsonNewContent);
  console.log(`Changed ${packageFile}`);
} else {
  console.log(packageJsonNewContent);
}

const readmeFile = path.join(__dirname, 'README.md');
const readme = fs.readFileSync(readmeFile)
  .toString()
  .replace(/XXX/g, name)
  .replace(/<!-- START RENAME -->[\s\S]*<!-- END RENAME -->/g, `\`\`\`\nyarn install ${name}\n\`\`\``);

if (!process.env.DRY) {
  fs.writeFileSync(readmeFile, readme);
  console.log(`Changed ${readmeFile}`);
} else {
  console.log(readme);
}
