import magu from '../lib/magu';

magu({
  heading: '<h{level} class="md__h">{text}</h{level}>'
}, [])
  .process(`${__dirname}/example.md`)
  .then(result => {
    console.log(result.html);
  });
