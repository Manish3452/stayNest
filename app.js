require("dotenv").config();
// Core Module
const path = require('path');

// External Module
const express = require('express');
const session = require('express-session'); 
const mongoDbStore = require('connect-mongo')(session); 
const { default: mongoose } = require('mongoose');
const multer = require('multer');
const DB_PATH =  process.env.MONGO_URI;

// Local Module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/error");


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const randomString = (length) => {
 const characters = 'abcdefghijklmnopqrstuvwxyz';
 let result = '';
 for(let i=0; i < length; i++) {
  result += characters.charAt(Math.floor(Math.random()* characters.length ));
}
  return result;
}

const storage =  multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
filename: (req, file, cb) => {
  cb(null, randomString(10) + '-' + file.originalname);
}
})

const fileFilter = (req, file, cb) => {
  if(['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const multerOptions  = {
  storage, fileFilter
}

app.use(express.urlencoded());
app.use(multer(multerOptions).single('photo'));
// ✅ STATIC FIRST
app.use(express.static(path.join(rootDir, 'public')));
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));
app.use('/host/uploads', express.static(path.join(rootDir, 'uploads')));

  app.use(
  session({
    secret: 'my secret key',
    resave: false,
    saveUninitialized: false,
    store: new mongoDbStore({
      url: DB_PATH,
      collection: 'sessions'
    })
  })
);
// ✅ ROUTES AFTER
app.use((req, res, next) => {
   req.isLoggedIn = req.session.isLoggedIn;
  next();
 })

app.use(authRouter);
app.use(storeRouter);
app.use("/host", (req, res, next) => { 
  if(req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});

app.use("/host", hostRouter);

app.use(errorsController.pageNotFound);

const PORT = process.env.PORT || 3000;

mongoose.connect(DB_PATH).then(() => {  
  console.log('✅ Mongoose connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
