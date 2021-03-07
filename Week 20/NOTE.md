# 第二十周学习笔记

[TOC]

## 持续集成
客户端持续集成：daily build  + BVT（build verification test）。

前端持续集成：提交前 build + lint。

三部分：Git Hooks + eslint + 无头浏览器

## Git Hooks
在每个 Git 库中，.git/hooks 文件夹内就有脚本示例, 使用 bash 编写。去掉示例的后缀名后就可以执行。每个示例都代表一个类型的钩子。

对客户端来说，最重要的是 pre-commit 和 pre-push 钩子，一般把 lint 放到 pre-commit 中，最终的 check 放到 pre-push 中。服务端一般使用 pre-receive 钩子。

钩子脚本可以使用 node 编写，在脚本头部用 #!/usr/bin/env node 指定用 node 执行。脚本需要赋予执行权限。

```javascript
#!/usr/bin/env node
let process = require('process'); // 引入模块
console.log('Hello hooks!');
process.exitCode = 1; // 阻止提交
```

通过在脚本中进行判断，可以实现有条件的 commit。

## ESLint

``` sh
# 初始化项目
npm init -y
# 配置 eslint
npx eslint --init
# 检查文件
npx eslint index.js
```

ESLint 有很多现成规则和 preset，按需使用。


### ESLint 与 Git Hooks 结合
一般不使用命令行，而是使用 ESLint API。
```javascript
const { ESLint } = require('eslint');

(async function main() {
  // 初始化。在 pre-commit 钩子中使用是，fix 千万不能为 true
  const eslint = new ESLint({ fix: false }); 
  // lint
  const results = await eslint.lintFiles(['lib/**/*.js']);
  // modify。不修改文件时跳过
  await ESLint.outputFixes(results);
  // format the results
  const formatter = await eslint.loadFormatter('stylish');
  const resultText = formatter.format(results);
  // output
  console.log(resultText);
})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});

```

#### ESLint 配置只检查暂存区文件
> ESLint 只会检查当前目录下的文件。
> 当要检查的文件已经被提交到暂存区，而工作区对应文件还有修改时，ESLint 检查的实际是工作区的文件，而不是暂存区将要 commit 的文件。
> 此时，需要使用 git stash -k 命令只把工作区的改动存起来。此时就可以检查暂存区的文件。
配置 pre-commit 钩子，在 commit 前运行 git stash -k 命令。


#### web hooks
代码仓库提供的功能，各有不同。但更有强制性，不受本地运行影响。

### 使用无头浏览器检查 DOM
由于 phontomJS 比较旧了，推荐使用 chrome 的 Headless 模式。

```
# 获取页面执行后的 DOM，写入到文件中
chrome --headless --dump-dom about:blank > dom.txt
```

#### Puppeteer
chrome 推出的对 headless 的封装，node 调用非常方便。

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ executablePath: 'google-chrome' });
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();
```

puppeteer 中的操作都需要使用 await，异步操作。

### 小结
通过把 lint 和 无头浏览器 集成到 git hooks 中，可以构建出强有力的持续集成系统，保证发布代码的基本质量。