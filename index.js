require("dotenv").config();
require("./config/db.config")()

const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({origin: process.env.REACT_APP_URL}));


const userRouter = require("./routes/user.routes")
app.use("/user", userRouter)


app.listen(Number(process.env.PORT), ()=>{
    console.log("Server up! PORT:", process.env.PORT);
});