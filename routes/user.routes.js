const router = require("express").Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/User.model");


const generateToken = require("../config/jwt.config");
const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

saltRounds = 10;

router.post("/signup", async (req,res) =>{
    try{
        const {password} = req.body

        if(!password || !password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)){
            return res.status(400).json({
                msg:"Password required and must have an upper case, an lower case, a number and a special character."
            })
        };

        const salt= await bcrypt.genSalt(saltRounds)
        const passwordHash = await bcrypt.hash(password, salt)
        const createdUser = await UserModel.create({
            ...req.body,
            passwordHash: passwordHash,
        })

        delete createdUser._doc.passwordHash
        return res.status(201).json(createdUser)

    } catch(error){
        console.log(error)
        return res.status(500).json(error)
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne(
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

    router.get("/user-profile", async (req, res) => {
        
        try {
            const foundedUser = await UserModel.findOne(
                { _id: req.body._id },
            );
            return res.status(200).json(foundedUser);
            
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    })
        
        

    router.patch("/update-profile", isAuth, attachCurrentUser, async (req, res) => {
        try {
            const loggedInUser = req.currentUser;

            const updatedUser = await UserModel.findOneAndUpdate(
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

    router.delete("/delete-user", isAuth, attachCurrentUser, async (req, res) => {
        try {
            const deletedUser = await UserModel.findOneAndUpdate(
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

router.patch("/addfav/:restaurantId", isAuth, attachCurrentUser, async (req,res) => {
    try{

        const addedfav = await UserModel.findOneAndUpdate(
            { _id: req.currentUser._id },
            { $push: { restaurants: req.params.restaurantId }},
            {new:true})

            return res.status(200).json(addedfav)
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
})


module.exports = router