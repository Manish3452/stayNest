const Home = require('../models/home');
const User = require('../models/user');

exports.getIndex = (req, res, next) => {
  
 Home.find().then(registeredHomes => {
  res.render('store/index', {registeredHomes: registeredHomes, pageTitle: 'airbnb Home', currentPage: 'index',
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
});
};

exports.getHomes = (req, res, next) => {
 Home.find().then(registeredHomes => {
  res.render('store/home-list', {registeredHomes: registeredHomes, pageTitle: 'Homes List', currentPage: 'home',
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  })
  });
  
};



exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourites');
  res.render('store/favourite-list', {
  favouriteHomes: user.favourites,
  pageTitle: 'My Favourites',
  currentPage: 'favourites',
  message: null,
  isLoggedIn: req.isLoggedIn,
  user: req.session.user,
});
        }

        exports.getBookings = async (req, res, next) => {
  const userId = req.session.user._id;
   const user = await User.findById(userId).populate('bookings');
  res.render('store/bookings-list', {
  bookingHomes: user.bookings,
  pageTitle: 'BookingHomes',
  currentPage: 'bookings',
  isLoggedIn: req.isLoggedIn,
  user: req.session.user,
});
}

exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
 const userId = req.session.user._id;
 const user = await User.findById(userId);
 if(!user.favourites.includes(homeId)) {
 user.favourites.push(homeId);
await user.save();
 }
    res.redirect('/favourite-list');
    };

    exports.postBookings = async (req, res, next) => {
  const homeId = req.body.id;
 const userId = req.session.user._id;
 const user = await User.findById(userId);
 if(!user.bookings.includes(homeId)) {
 user.bookings.push(homeId);
await user.save();
 }
    res.redirect('/bookings-list');
    };

exports.postRemoveFromFavourite = async (req, res, next) => {
   const homeId = req.params.homeId;
   const userId = req.session.user._id;
 const user = await User.findById(userId);
  if (user.favourites.includes(homeId)) {
      user.favourites = user.favourites.filter(fav => fav != homeId);
      await user.save();
  }
     res.redirect('/favourite-list');

}

exports.postDeleteBook = async (req, res, next) => {
   const homeId = req.params.homeId;
   const userId = req.session.user._id;
 const user = await User.findById(userId);
  if (user.bookings.includes(homeId)) {
      user.bookings = user.bookings.filter(book => book != homeId);
      await user.save();
  }
     res.redirect('/bookings-list');

}

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("At home details Page", homeId);
  Home.findById(homeId).then(home => {
    if(!home) {
      console.log("Home Not Found");
        res.redirect('/homes');
      } else {
        console.log("Home Found");
    res.render("store/home-detail", {home:home, pageTitle:"Home Detail", currentPage:"home",
      isLoggedIn: req.isLoggedIn,
       user: req.session.user,
    } );
      }
  });
  
};

exports.getHomeRules = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("At Homes Rules", homeId);
  if(req.isLoggedIn) { 
    Home.findById(homeId).then(home => {
  res.render("store/home-rules", { 
    home:home,
    pageTitle:"Home Rules", 
    currentPage:"home",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    }) ;
  });
} else {
  res.redirect('/login');
}
  
};
