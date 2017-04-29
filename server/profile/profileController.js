/* Has functions to interact with MongoDB */
const Profile = require('./profileModel.js');


const test = new Profile({ 
  id: 123,
  name: 'Wallace',
  lastMatch: 321,
  matrix: {
    ekko: {
      wat: 'wat'
    },
    braum: {
      wat: 'wat'
    }
  }
});


test.save()
.then(doc => {
  return Profile.findOne({ id: 123 }).exec()
})
.then(doc => {
  console.log('Found it!', doc);
  console.log('Cleansing');
  Profile.remove({});
});

