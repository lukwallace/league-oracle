const Oracle = require('../oracle');

const o = new Oracle();
o.generateMatrix('wallace')
.then(matrix => {
  console.log(matrix);
  return o.generateMatrix('wallace');
})
.then(matrix => {
  console.log('Ding!');
});