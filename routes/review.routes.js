const router = require("express").Router();
const RestaurantModel = require("../models/Restaurant.model");
const ReviewModel = require("../models/Review.model");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const attachCurrentRestaurant = require("../middlewares/attachCurrentRestaurant")
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


/*router.patch("update-review", isAuth, attachCurrentUser, async (req,res) =>{
    try{

        const updatedReview = await ReviewModel.findOneAndUpdate(

        )
    } catch(error) {
        return res.status(500).json(error);
        console.log(error);
    }
})*/

router.delete("/delete-review/:reviewId", isAuth, attachCurrentUser, async (req,res) =>{
    try{

        const foundReview = await ReviewModel.findOne({_id: req.params.reviewId})
        const user = req.currentUser
        if (!user || user._id.toString() !== foundReview.user.toString()) {
            console.log(user._id)
            console.log(foundReview.user)
            return res.status(401).json({msg: "Unauthorized user"})}

        const deletedReview = await ReviewModel.findOneAndDelete(
            {_id: req.params.reviewId}
        )

        const updatedRestaurant = await RestaurantModel.findOneAndUpdate(
            {_id: foundReview.restaurant},
            { $pull: { reviews: foundReview._id }}
        )

        return res.status(200).json({msg: "Review Deleted !"})

    } catch(error) {
        return res.status(500).json(error);
        console.log(error);
    }
})

router.patch("/postanswer/:reviewId", isAuth, attachCurrentRestaurant, async (req,res)=>{
    try{

        const foundReview = await ReviewModel.findOne({_id: req.params.reviewId})
        const restaurant = req.currentUser
        if (!restaurant || restaurant._id.toString() !== foundReview.restaurant.toString()) {
            console.log(restaurant._id)
            console.log(foundReview.restaurant)
            return res.status(401).json({msg: "Unauthorized user"})}

        const answer = await ReviewModel.findOneAndUpdate(
            {_id: foundReview._id},
            {... req.body},
            {new: true}
        )

        return res.status(200).json(foundReview)

    } catch(error) {
        return res.status(500).json(error);
        console.log(error);
    }
})

module.exports = router;