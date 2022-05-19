const nodemailer = require("nodemailer");
const RestaurantModel = require("../models/Restaurant.model");
const router = require("express").Router();

const transporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
       user: process.env.MAIL_USER, 
       pass: process.env.MAIL_PASS
     } 
    })

const mailOptions = {
    from: 'restoapp71@gmail.com',
    to: 'hudson_arpini@hotmail.com',
    subject: 'Reserva no Restô',
    html: '<p>Sua reserva foi feita com sucesso!</p>'
  }

  router.post("/sendmail/:restaurantId", async (req, res) => {
      try{

    const restaurant = await RestaurantModel.findOne({_id : req.params.restaurantId})

    transporter.sendMail(
        {
        from: 'restoapp71@gmail.com',
        to: 'hudson_arpini@hotmail.com',
        subject: "Reserva no Restô feita!",
        text: `Tantas pessoas :${req.body.pessoas}`
      }
    )

    transporter.sendMail(
        {
        from: 'restoapp71@gmail.com',
        to: `${restaurant.email}`,
        subject: `${restaurant.name}`,
        text: `Tantas pessoas :${req.body.pessoas}`
      }
    )
      }catch(error){console.log(error)}
}) 

module.exports = router