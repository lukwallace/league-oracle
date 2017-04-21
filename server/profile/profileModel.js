const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

/* Connect to database -- moved here for easy testing */
mongoose.connect('mongodb://localhost/league-oracle');
mongoose.connection.on('open', () => {
  console.log('Mongoose connection open!');
});
/* ================================================== */

const profileSchema = new Schema({
  id: Number,
  region: String,
  name: String,
  lastMatch: Number,
  matrix: Schema.Types.Mixed
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;