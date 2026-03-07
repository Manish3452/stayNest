//External module
const express = require('express');
const storeRouter = express.Router();

//Local module
const storeController = require('../controllers/storeController');

storeRouter.get('/', storeController.getIndex);
storeRouter.get('/homes', storeController.getHomes);
storeRouter.get('/bookings-list', storeController.getBookings);
storeRouter.get('/favourite-list', storeController.getFavouriteList);
storeRouter.get('/homes/:homeId', storeController.getHomeDetails);
storeRouter.get("/rules/:homeId", storeController.getHomeRules);
storeRouter.post('/favourites', storeController.postAddToFavourite);
storeRouter.post('/favourites/delete/:homeId', storeController.postRemoveFromFavourite);
storeRouter.post('/bookings/delete/:homeId', storeController.postDeleteBook);
storeRouter.post('/bookings', storeController.postBookings);


module.exports = storeRouter;


