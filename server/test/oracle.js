const Oracle = require('../oracle');

const o = new Oracle();
o.fetchMatrix('wallace')
.then(matrix => {
  console.log(matrix);
});

