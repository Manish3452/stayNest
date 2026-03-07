const User = require('../models/user');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt'); 

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
     currentPage: 'login',
     isLoggedIn: req.isLoggedIn,
     errors: [],
     oldInput: {},
    user: {},
});  
}

exports.getSignUp = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'signup',
     currentPage: 'signup',
     isLoggedIn: req.isLoggedIn,
     errors: [],
     oldInput: {},
     user: {},
});  
}

exports.postLogin = async(req, res, next)=> {
  const {email, password} = req.body;
  const user = await User.findOne({email});
if (!user) {
  return res.status(422).render('auth/login', 
      {pageTitle: "login",
        currentPage: "login",
        isLoggedIn: false,
        errors: ["User does not exist"],
        oldInput: {email},
        user: {},
      }); 
}

const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
   return res.status(422).render('auth/login', 
      {pageTitle: "login",
        currentPage: "login",
        isLoggedIn: false,
        errors: ["Invalid Password"],
        oldInput: {email},
        user: {},
      }); 
}

  // res.isLoggedIn = true;
  req.session.isLoggedIn = true;
  req.session.user = user;
  req.session.save(err => {
  if (err) {
    console.log("error:", err, "endnhvh");
  }
  res.redirect('/');
});
}
exports.postLogout = (req, res, next)=> {
  // res.isLoggedIn = true;
  // res.cookie('isLoggedIn', false);
  // req.session.isLoggedIn = false;
  req.session.destroy(() => {
  res.redirect('/login');
   });
}

exports.postSignUp = [
  //First Name validation
  check("firstName")
  .trim()
  .isLength({min: 2})
  .withMessage("First Name should be atleast 2 character long")
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage("First name should contain only alphabets"),  
  
  //Last Name validation
  check("lastName")
  .matches(/^[a-zA-Z\s]*$/)
  .withMessage("Last name should contain only alphabets"),

  //email validation
  check('email')
  .isEmail()
  .withMessage("please enter a valid email")
  .normalizeEmail(),

  check("password")
  .isLength({min: 5})
  .withMessage("Password should be atleast 5 characters long")
  .matches(/[A-Z]/)
  .withMessage("Password should contain atleast one uppercase letter")
  .matches(/[a-z]/)
  .withMessage("Password should contain atleast one lowercase letter")
  .matches(/[0-9]/)
  .withMessage("Password should contain atleast one number")
  .matches(/[!@&]/) 
  .withMessage("Password should contain atleast one special character")
  .trim(),

  //confirm password validation
  check("confirmPassword")
  .trim()
  .custom((value, { req }) => {
     if(value !== req.body.password) {
      throw new Error("password do not match");
     }
     return true;
  }),

  check("userType")
  .notEmpty()
  .isIn(['guest','host'])
  .withMessage("Invalid User Type"),

  check("terms")
  .notEmpty()
  .withMessage("Please accept the terms and conditions")
  .custom( (value, {req}) => {
    if(value !== "on") {
      throw new Error("Please accept the terms and conditions");
    }
    return true;
  }),

(req, res, next) => {
  const{firstName, lastName, email, password, userType} = req.body;
  console.log(req.body);
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).render('auth/signup', 
      {pageTitle: "signup",
        currentPage: "signup",
        isLoggedIn: false,
        errors: errors.array().map(err=> err.msg),
        oldInput: {firstName, lastName, email, userType},
        user: {},
      }); 
  }

  //password encryption
  bcrypt.hash(password, 12)
  .then(hashedPassword => { 
    const user = new User({firstName, lastName, email, password: hashedPassword, userType});
    return user.save();
  })
    .then(() => {
      res.redirect('/login');
    }).catch(err => {
      console.log("error while data storing in db", err);
        return res.status(422).render('auth/signup', 
      {pageTitle: "signup",
        currentPage: "signup",
        isLoggedIn: false,
        errors: [err],
        oldInput: {firstName, lastName, email, userType},
        user: {},
      }); 
    });
}
]