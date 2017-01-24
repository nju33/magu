import test from 'ava';
import {spy} from 'sinon';
import cheerio from 'cheerio';
import magu, {
  funcs,
  formatArguments,
  createStringTemplateFunc
} from '../lib/magu';

// test.todo('formatArguments');
test('formatArguments', t => {
  const text = 'aieuo';
  const level = 1;

  function func() {
    const heading = funcs.find(func => func[0] === 'heading');
    return formatArguments(arguments, heading[1]);
  }

  const result = func(text, level);

  t.truthy(result.text);
  t.is(result.text, text);
  t.truthy(result.level);
  t.is(result.level, level);
});

test('createStringTempalteFunc', t => {
  const heading = funcs.find(func => func[0] === 'heading');
  const func =
    createStringTemplateFunc('<h{level}>{text}</h{level}>', heading[1]);
  const result = func('aiueo', 1);

  t.is(typeof func, 'function');
  t.is(result, '<h1>aiueo</h1>');
});

test('plugin call', async t => {
  const plugin = spy();
  await magu({}, [plugin]).process(`${__dirname}/fixtures.md`);

  const pluginCall = plugin.getCall(0);
  t.true(plugin.called);
  t.is(pluginCall.args[0].html(), '<p>aiueo</p>\n');
  t.is(pluginCall.args[1], cheerio);
});

test('promise plugin', async t => {
  const plugin = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(cheerio.load('aieuo'));
      });
    });
  };

  const result = await magu({}, [plugin]).process(`${__dirname}/fixtures.md`);
  t.is(result.html, '<p>aiueo</p>\n');
});

test('markdown compile', async t => {
  const result = await magu({}, []).process(`${__dirname}/fixtures.md`);
  t.truthy(result.html);
  t.is(result.html, '<p>aiueo</p>\n');
});

test('Pass content instead of absolute path', async t => {
  const result = await magu({}, []).process('aiueo');
  t.truthy(result.html);
  t.is(result.html, '<p>aiueo</p>\n');
});

test('Set method', async t => {
  const result = await magu({
    heading(text) {
      return `foo${text}`;
    }
  }, []).process('# aiueo');

  t.is(result.html, 'fooaiueo');
});
