const { Schema, model, default: mongoose } = require("mongoose");

const reviewSchema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: "User"},
    restaurant: { type: mongoose.Types.ObjectId, ref: "Restaurant" },
    tags: [{type: String}],
    comment: {type: String, minlength:1,},
    rate: {type: Number, min:1 , max:5},
    date: { type: Date },
    answers: [{type: String}]
})

const ReviewModel = model("Review", reviewSchema);

module.exports = ReviewModel;