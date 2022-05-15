const { Schema, model, default: mongoose } = require("mongoose");

const restaurantSchema = new Schema({
    name: { type: String, required: true, trim: true },
    birth: { type: Date, required: true },
    address: { type: String, required: true },
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
    reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
    imgUser: { type: String },
    isActive: { type: Boolean, default: true },
    disabledOn: { type: Date },
});

const RestaurantModel = model("Restaurant", restaurantSchema);

module.exports = RestaurantModel;