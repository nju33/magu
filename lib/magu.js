import fs from 'fs';
import path from 'path';
import pupa from 'pupa';
import marked from 'marked';
import cheerio from 'cheerio';

const funcs = [
  ['code', ['code', 'language']],
  ['blockquote', ['quote']],
  ['html', ['html']],
  ['heading', ['text', 'level']],
  ['hr', []],
  ['list', ['body', 'ordered']],
  ['listitem', ['text']],
  ['paragraph', ['text']],
  ['table', ['header', 'body']],
  ['tablerow', ['content']],
  ['tablecell', ['content', 'flags']],
  ['strong', ['text']],
  ['em', ['text']],
  ['codespan', ['code']],
  ['br', []],
  ['del', ['text']],
  ['link', ['href', 'title', 'text']],
  ['image', ['href', 'title', 'text']]
];
export {funcs};

export default function magu(rendererFuncs = {}, plugins = []) {
  let renderer = marked;
  const resultRendererFuncs = {};

  if (typeof rendererFuncs === 'object') {
    const _renderer = new marked.Renderer();
    funcs.forEach(([name, argnames]) => {
      const target = rendererFuncs[name];
      if (!target || typeof target === 'function') {
        return;
      }
      const realFunc = createStringTemplateFunc(rendererFuncs[name], argnames);
      resultRendererFuncs[name] = realFunc;
    });
    Object.assign(_renderer, resultRendererFuncs);
    renderer = (opts => {
      return markdown => {
        return marked(markdown, opts);
      };
    })({renderer: _renderer});
  }

  return {
    async process(pathOrContent) {
      let markdown = pathOrContent;
      if (path.isAbsolute(pathOrContent)) {
        try {
          markdown = await readFile(pathOrContent);
        } catch (err) {
          throw err;
        }
      }
      let html = renderer(markdown);

      if (Array.isArray(plugins)) {
        html = applyPlugins(plugins, html);
      }

      const result = {html};
      return result;
    }
  };
}

function readFile(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf-8', (err, content) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(content);
    });
  });
}

function formatArguments(args, argnames) {
  const result = [].reduce.call(args, (result, value, idx) => {
    const key = argnames[idx];
    result[key] = value;
    return result;
  }, {});
  return result;
}
export {formatArguments};

function createStringTemplateFunc(template, argnames) {
  return function () {
    const args = formatArguments(arguments, argnames);
    const funcResult = pupa(template, args);
    return funcResult;
  };
}
export {createStringTemplateFunc};

function applyPlugins(plugins, html) {
  const result = plugins.reduce((html, plugin) => {
    // Set `decodeEntities` because Japanese garbles
    const $ = cheerio.load(html, {
      decodeEntities: false
    });
    const value = plugin($, cheerio);

    if (typeof value === 'string') {
      return value;
    }
    return $.html();
  }, html);
  return result;
}
export {applyPlugins};
