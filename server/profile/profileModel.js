const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const profileSchema = new Schema({
  id: Number,
  name: String,
  lastMatch: Number,
  matrix: Schema.Types.Mixed
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;