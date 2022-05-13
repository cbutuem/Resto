const mongoose = require("mongoose");

async function connect() {
    try{
        const dbConnection = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to database:", dbConnection.connections[0].name);

    }catch(error){
        console.log("Connection fail", error);
    }
    
}
module.exports = connect;