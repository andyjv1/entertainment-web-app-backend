const express = require('express')
const app = express()
const { logger, logEvents } = require('../middleware/logger')
const connectDB = require('../config/dbConn')
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3500
const TvMovie = require("../models/TvMovie");


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB entertainmentDB Database seeds')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})


const seedDB = async () => {
  await TvMovie.deleteMany({});
    const c = new TvMovie({
    title: "Beyond Earth",
    thumbnail: {
      trending: {
        small: "./assets/thumbnails/beyond-earth/trending/small.jpg",
        large: "./assets/thumbnails/beyond-earth/trending/large.jpg"
      },
      regular: {
        small: "./assets/thumbnails/beyond-earth/regular/small.jpg",
        medium: "./assets/thumbnails/beyond-earth/regular/medium.jpg",
        large: "./assets/thumbnails/beyond-earth/regular/large.jpg"
      }
    },
    year: 2019,
    category: "Movie",
    rating: "PG",
    isBookmarked: false,
    isTrending: true
    })
    await c.save()
};

seedDB().then(() => {
  mongoose.connection.close();
});