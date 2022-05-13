const router = require("express").Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/User.model");

saltRounds = 10


router.post("/signup", async (req,res) =>{
    try{

        const {password} = req.body

        if(!password || !password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)){
            return res.status(400).json({
                msg:"Password required and must have an upper case, an lower case, a number and a special character."
            })
        }

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
})

module.exports = router