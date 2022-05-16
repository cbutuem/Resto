const router = require("express").Router();
const RestaurantModel = require("../models/Restaurant.model");
const bcrypt = require("bcrypt");

const generateToken = require("../config/jwt.config");
const isAuth = require("../middlewares/isAuth");
const attachCurrentRestaurant = require("../middlewares/attachCurrentRestaurant");

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

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await RestaurantModel.findOne(
            { email: email }
        );

        if (!user) {
            return res.status(400).json(
                { msg: "Password or email doesn't match!" }
            );
        }

        if ( await bcrypt.compare(password, user.passwordHash)) {
            delete user._doc.passwordHash;
            const token = generateToken(user);

            return res.status(200).json({
                token: token,
                user: { ...user._doc },
            });
        } else {
            return res.status(400).json({
                msg: "Password or email doesn't match!"
            });
        }

    }   catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }

});
//  PRÓPRIO RESTAURANTE ACESSA O PERFIL
    router.get("/user-profile", isAuth, attachCurrentRestaurant, (req, res) => {
        return res.status(200).json(req.currentUser);
    })

//USUÁRIOS ACESSAM O PERFIL DO RESTAURANTE
    router.get("/profile/:restaurantId", async (req, res) => {
        try{
            const foundRestaurant = await RestaurantModel.findOne({_id: req.params.restaurantId});
            delete foundRestaurant._doc.passwordHash;
            return res.status(200).json(foundRestaurant)

        } catch (error) {
        console.log(error);
        return res.status(500).json(error);
        }
    
})

//VER TODOS OS RESTAURANTES
router.get("/all-restaurants", async (req, res) => {
    try{
        const restaurants = await RestaurantModel.find().select("-passwordHash") 
        return res.status(200).json(restaurants)

    } catch (error) {
    console.log(error);
    return res.status(500).json(error);
    }

})

    router.patch("/update-profile", isAuth, attachCurrentRestaurant, async (req, res) => {
        try {
            const loggedInUser = req.currentUser;

            const updatedUser = await RestaurantModel.findOneAndUpdate(
                { _id: loggedInUser._id },
                { ...req.body },
                { runValidators: true, new: true }
            );

            delete updatedUser._doc.passwordHash;
            return res.status(200).json(updatedUser);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    })

    router.delete("/delete-user", isAuth, attachCurrentRestaurant, async (req, res) => {
        try {
            const deletedUser = await RestaurantModel.findOneAndUpdate(
                { _id: req.currentUser._id },
                { isActive: false, disabledOn: Date.now() },
                { runValidators: true, new: true }
            );

            delete deletedUser._doc.passwordHash;
            return res.status(200).json(deletedUser);
    }  catch(error) {
        console.log(error);
        return res.status(500).json(error);
    };
});


module.exports = router;