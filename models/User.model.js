const { Schema, model, default: mongoose } = require("mongoose");

const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    birth: { type: Date, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    },
    passwordHash: { type: String, required: true },
    city: { type: String, required: true }, 
    favType: [{ type: String, required: true }],
    restaurants: [{ type: Object }],
    imgUser: { type: String },
    isActive: { type: Boolean, default: true },
    disabled: { type: Date },
});

const UserModel = model("User", userSchema);

module.exports = UserModel;