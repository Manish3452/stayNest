const Home = require('../models/home');
const fs = require('fs');

exports.getAddHome = (req, res, next) => {
  res.render('host/edit-home', {
    pageTitle: 'Add Home to airbnb',
     currentPage: 'addHome',
     editing: false,
     isLoggedIn: req.isLoggedIn,
     user: req.session.user,
});  
};

exports.postAddHome = (req, res, next) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  if (!req.file) {
    return res.status(422).send("No image provided");
  }
    if (!req.body) {
    return res.status(422).send("req.body is undefined ❌");
  }

  const { houseName, location, price, rating, description } = req.body;

  const photo = req.file.path;

  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
    description,
  });
  home.save().then(() => {
    console.log("Home Saved successfully");
  });

  res.redirect("/host/homes-list");
};

exports.getHostHomes = (req, res, next) => {
   Home.find().then(registeredHomes => {
  res.render('host/host-homes-list', {registeredHomes: registeredHomes, pageTitle: 'Host Homes List', currentPage: 'hostHomes',
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  })
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === 'true';

  Home.findById(homeId).then(home => {
    if (!home) {
      console.log("Home not found for editing.");
      return res.redirect("/host/homes-list");
    }
    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit your Home",
      currentPage: "host-homes",
      editing: editing, 
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.postEditHome = (req, res, next) => {
      const {id, houseName, location, price, rating, description} = req.body;
      Home.findById(id).then((home) =>{
        home.houseName = houseName;
        home.price = price;
        home.location = location;
        home.rating = rating;
        home.description = description;

        if(req.file) {
        fs.unlink(home.photo, (err) => {
        if(err) {
        console.log("error while deleting file", err);
              }
        })
        home.photo = req.file.path;
        }

        home.save().then( result => {
        console.log("Home updated successfully.", result);
        }).catch(err => {
         console.log("error while updating", err);
        });
         res.redirect('/host/homes-list');
      }).catch(err => {
         console.log("error while finding home", err);
        });
  }

  exports.postDeleteHome = (req, res, next) => { 
    const homeId = req.params.homeId;
    console.log('came to delete:',homeId);
    Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect('/host/homes-list');
    }).catch(err => {
      console.log("Error while deleting home:", err);
    });
  }