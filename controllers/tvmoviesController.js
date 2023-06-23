const TvMovie = require('../models/TvMovie')
const asyncHandler = require('express-async-handler')

// @desc Get all tv/movies
// @route GET /tv/movies
// @access Private

const getAllTvmovies = asyncHandler(async (req, res) => {

    // Get all tv/movies from the database
    const tvmovies = await TvMovie.find().lean()

    // If there is no tv/movies
    if (!tvmovies?.length) {
        return res.status(400).json({ message: 'No tv/movies found' })
    }

    res.json(tvmovies)
})

// @desc Create new tv/movies
// @route POST /tv/movies
// @access Private    


const createNewTvmovie = asyncHandler(async (req, res) => {
    const { title, thumbnail, year, category, rating, isTrending } = req.body

    // Confirm the data received
    if (!title || !thumbnail || !year || !category || !rating || !isTrending) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate tv/movies
    const duplicate = await TvMovie.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate tv/movie title' })
    }

    // Create and store the new tv/movies
    const tvmovie = await TvMovie.create({ title, thumbnail, year, category, rating, isTrending })

    if (tvmovie) {
        return res.status(201).json({ message: 'New tv/movie created' })
    } else {
        return res.status(400).json({ message: 'Invalid tv/movie data received' })
    }
})

// @desc Update a tv/movie
// @route PATCH /tv/movies
// @access Private

const updateTvmovie = asyncHandler(async (req, res) => {
})


// @desc Delete a tv/movies
// @route DELETE /tv/movies
// @access Private

const deleteTvmovie = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm the data received
    if (!id) {
        return res.status(400).json({ message: 'tv/movie ID required' })
    }

    // Check if the tv/movies exist to delete?
    const tvmovie = await TvMovie.findById(id).exec()

    if (!tvmovie) {
        return res.status(400).json({ message: 'Tv/movie not found' })
    }

    const result = await tvmovie.deleteOne()

    const reply = `Tv/movie '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllTvmovies,
    createNewTvmovie,
    updateTvmovie,
    deleteTvmovie
}