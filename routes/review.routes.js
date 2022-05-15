const router = require("express").Router();
const RestaurantModel = require("../models/Restaurant.model");
const ReviewModel = require("../models/Review.model");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const isAuth = require("../middlewares/isAuth");


router.post("/postreview/:restaurantId", isAuth, attachCurrentUser, async (req, res) => {
    try {
        const createdReview = await ReviewModel.create({
            ...req.body,
            date: Date.now(),
            restaurant: req.params.restaurantId,
            user: req.currentUser._id
    });
    
    const foundReview = await RestaurantModel.findOneAndUpdate(
        { _id: req.params.restaurantId },
        { $push: { reviews: createdReview._id } },
        { runValidators: true, new: true }
    );

    return res.status(201).json(createdReview);

}   catch(error) {
    return res.status(500).json(error);
    console.log(error);
}
});

module.exports = router;