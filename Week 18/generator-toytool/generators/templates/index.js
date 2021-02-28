var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }
  async initPackage() {
    let answer = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        defalut: this.appname
      }
    ])

    const pkgJson = {
      "name": answer.name,
      "version": "1.0.0",
      "description": "",
      "main": "generators/app/index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      devDependencies: {
        'webpack': '4.44.2',
        'css-loader': '^4.3.0',
        'copy-webpack-plugin': '^6.0.0',
        "@babel/core": "^7.13.1",
        "@babel/preset-env": "^7.13.5",
        "@babel/register": "^7.13.0",
        "@istanbuljs/nyc-config-babel": "^3.0.0",
        "babel-plugin-istanbul": "^6.0.0",
      },
      dependencies: {

      }
    };
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    this.npmInstall(['vue'], { 'save-dev': false });
    this.npmInstall(['vue-loader', 'vue-template-compiler', 'vue-style-loader'], { 'save-dev': true });
    this.npmInstall(['mocha'], { 'save-dev': true });
    this.npmInstall(['nyc'], { 'save-dev': true });
    this.npmInstall(['nyc'], { 'save-dev': true });
  }
  copyFiles() {
    this.fs.copyTpl(
      this.templatePath('HelloWorld.vue'),
      this.destinationPath('src/HelloWorld.vue'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('template.html'),
      this.destinationPath('src/index.html'),
      {}
    );
  }
}