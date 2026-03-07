
//External module
const express = require('express');
const hostRouter = express.Router();
//Local module
const  hostController  = require('../controllers/hostController');


hostRouter.get('/add-home', hostController.getAddHome);

hostRouter.post(
  '/add-home',  
  hostController.postAddHome
);

hostRouter.post('/edit-home', hostController.postEditHome);
hostRouter.post('/delete-home/:homeId', hostController.postDeleteHome);



hostRouter.get('/homes-list', hostController.getHostHomes);
hostRouter.get('/edit-home/:homeId', hostController.getEditHome);

module.exports = hostRouter; 
