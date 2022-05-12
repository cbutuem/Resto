const { Schema, model, default: mongoose } = require("mongoose");

const restaurantSchema = new Schema({
    name: { type: String, required: true, trim: true },
    birth: { type: Date, required: true },
    adress: { type: Date, required: true },
    city: { type: String, required: true }, 
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    },
    passwordHash: { type: String, required: true },
    foodCategory: [{ type: String, required: true }],
    imgUser: { type: String },
    isActive: { type: Boolean, default: true },
    disabled: { type: Date },
});

const RestaurantModel = model("User", restaurantSchema);

module.exports = RestaurantModel;