const { Schema, model, default: mongoose } = require("mongoose");

const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    birth: { type: Date},
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
    restaurants: [{ type: mongoose.Types.ObjectId, ref: "Restaurant" }],
    imgUser: { type: String },
    isActive: { type: Boolean, default: true },
    disabledOn: { type: Date },
});

const UserModel = model("User", userSchema);

module.exports = UserModel;