const router = require("express").Router();
const RestaurantModel = require("../models/Restaurant.model");
const bcrypt = require("bcrypt");

const saltRounds = 10;

router.post("/signup", async (req, res) => {
    try {
        const {password} = req.body;

        if (!password || !password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)) {
            return res.status(400).json({
                msg: "Password is required and must have an upper case, an lower case, a number and a special character."
            });
        }
        
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const createdRestaurant = await RestaurantModel.create({
            ...req.body,
            passwordHash: passwordHash,
        });

        delete createdRestaurant._doc.passwordHash;

        return res.status(201).json(createdRestaurant);

    }   catch(error) {
        return res.status(500).json(error);
        console.log(error);
    }
});

module.exports = router;