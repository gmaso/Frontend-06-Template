var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }
  writing() {
    this.fs.copyTpl(
      this.templatePath('template.html'),
      this.destinationPath('public/index.html'),
      { title: 'Templating with Yeoman' }
    )
  }
  initPackage() {
    const pkgJson = {
      devDependencies: {
        eslint: '^3.15.0'
      },
      dependencies: {
        react: '^16.2.0'
      }
    };
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    this.npmInstall();
  }
  async method1() {
    this.log('method 1 just ran');
    const answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        defalut: this.appname
      },
      {
        type: 'confirm',
        name: 'cool',
        message: 'Would you linke to enable the Cool feature?'
      }
    ]);
    this.log('app name', answers.name);
    this.log('cool feature', answers.cool);
  }
  method2() {
    this.log('method 2 just ran');
  }
}