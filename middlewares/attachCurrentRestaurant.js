const RestaurantModel = require("../models/Restaurant.model");

module.exports = async (req, res, next) => {
    try {

        const loggedInUser = req.auth;

        const user = await RestaurantModel.findOne(
            { _id: loggedInUser._id },
            { passwordHash: 0 }
        );

        if (!user) {
            return res.status(400).json(
                { msg: "Restaurant not found!"}
            );
        }

        req.currentUser = user;
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};