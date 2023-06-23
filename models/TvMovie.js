const mongoose = require('mongoose')
// const AutoIncrement = require('mongoose-sequence')(mongoose)

const tvMovieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        thumbnail: {
            trending: {
                small: {
                    type: String,
                },
                large: {
                    type: String,
                }
            },
            regular: {
                small: {
                    type: String,
                    required: true
                }, 
                medium: {
                    type: String,
                    required: true
                }, 
                large: {
                    type: String,
                    required: true
                }
            }
        },
        year: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        rating: {
            type: String,
            required: true
        },
        // isBookmarked: {
        //     type: Boolean,
        //     default: false
        // },
        isTrending: {
            type: Boolean,
            default: false
        },

    })

module.exports = mongoose.model('TvMovie', tvMovieSchema)