import {highlight} from 'highlight.js';
import magu from '../lib/magu';

magu({
  heading: '<h{level} class="md__h">{text}</h{level}>',
  code(code, lang) {
    return `
<pre><code class="asldjf lang__${lang}">
  ${highlight(lang, code).value}
</code></pre>
    `;
  }
}, [])
  .process(`${__dirname}/example.md`)
  .then(result => {
    console.log(result.html);
  });
