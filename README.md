# Magu

Markdown compiler to based on Marked

[![Build Status](https://travis-ci.org/nju33/magu.svg?branch=master)](https://travis-ci.org/nju33/magu) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

## Install

```bash
yarn add magu
npm install magu
```

## Usage

```js
magu({ Methods of marked.Renderer }, [ Magu plugins ])
  .process(`${__dirname}/path/to/file.md`)
  .then(html => console.log(html));
```

`.process()` method expects **absolute path** or **content** to be passed.
If the passed in is absolute path, there is a process of reading the contents of the file

### Methods of `marked.Renderer`

Look at the [marked#block-level-renderer-methods](https://github.com/chjj/marked#block-level-renderer-methods) section.

```js
magu({
  headline(text, level) {
    return `<h${level}>${text}<h${level}>`;
  }
})
```

However, the only difference is that you can pass the string template.
For that template, you can use the value passed to that method as is.

```js
magu({
  headline: '<h{level}>{text}<h{level}>';
})
```

Please think that [sindresorhus/pupa](https://github.com/sindresorhus/pupa) is used for the development of this template, and it will be executed like this.

```js
pupa('<h{level}>{text}<h{level}>', {text, level});
```

## Make Plugin

The compiled html loaded with [cheeriojs/cheerio](https://github.com/cheeriojs/cheerio) will be passed as an argument.

`plugin($, cheerio) -> ($ or string)`

## Plugins

- [magu-plugin-toc](https://github.com/nju33/magu-plugin-toc)
- [magu-plugin-hljs](https://github.com/nju33/magu-plugin-hljs)
- [magu-plugin-anchor](https://github.com/nju33/magu-plugin-anchor)
- [magu-plugin-footnote](https://github.com/nju33/magu-plugin-footnote)

## License

The MIT License (MIT)
Copyright (c) 2016 nju33 <nju33.ki@gmail.com>
