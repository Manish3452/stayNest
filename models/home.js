  const mongoose = require('mongoose');
  const User = require('../models/user'); // import your user model

  const homeSchema = new mongoose.Schema({ 
    houseName: {
      type: String,
      required: true  
    },
    price: {
      type: Number,
      required: true
    },
    rating: {
      type: Number,
      required: true  
    },
    location: {
      type: String,
      required: true  
    },
    photo: String,
    description: String,
    
  });

  homeSchema.pre('findOneAndDelete', async function(next) {
  const homeId = this.getQuery()._id;
  
  // Pull the homeId from all users' favourites arrays
  await User.updateMany(
    { favourites: homeId },      // find users who have this home in favourites
    { $pull: { favourites: homeId } } // remove it from their favourites array
  );

});

  module.exports = mongoose.model('Home', homeSchema); 

