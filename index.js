require("dotenv").config();
<<<<<<< HEAD
const express = require("express");
const cors = require("cors");

=======

const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({origin: process.env.REACT_APP_URL}));

app.listen(Number(process.env.PORT), ()=>{
    console.log("Server up! PORT:", process.env.PORT);
});
>>>>>>> 379119706888b2befda2cba3f65b5277ab50aca1
