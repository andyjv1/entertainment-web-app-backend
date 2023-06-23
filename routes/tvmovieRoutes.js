const express = require('express')
const router = express.Router()
const tvmoviesController = require('../controllers/tvmoviesController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(tvmoviesController.getAllTvmovies)
    .post(tvmoviesController.createNewTvmovie)
    .patch(tvmoviesController.updateTvmovie)
    .delete(tvmoviesController.deleteTvmovie)
module.exports = router  