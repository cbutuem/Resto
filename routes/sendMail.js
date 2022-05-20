const nodemailer = require("nodemailer");
const RestaurantModel = require("../models/Restaurant.model");
const UserModel = require("../models/User.model");
const router = require("express").Router();

const transporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
       user: process.env.MAIL_USER, 
       pass: process.env.MAIL_PASS
     } 
    })



  router.post("/sendmail/:restaurantId", async (req, res) => {
      try{

    const restaurant = await RestaurantModel.findOne({_id : req.params.restaurantId})

    transporter.sendMail(
        {
        from: 'restoapp71@gmail.com',
        to: `${req.body.usermail}`,
        subject: `Reserva no Restô feita!`,
        html: ` <p>Sua reserva para ${req.body.pessoas} pessoas no ${restaurant.name} no dia ${req.body.data} às ${req.body.horario} está feita!</p>`
      }
    )

    transporter.sendMail(
        {
        from: 'restoapp71@gmail.com',
        to: `${restaurant.email}`,
        subject: `Reserva recebida pelo Restô!`,
        html: ` <p>${req.body.user} fez uma reserva para ${req.body.pessoas} pessoas no dia ${req.body.data} às ${req.body.horario}!</p>`
      }
    )
      }catch(error){console.log(error)}
}) 

module.exports = router