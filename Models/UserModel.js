const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name"],
        minLength: [4, "Title must be at Least 4 Character"],
        maxLength: [80, "Title can't exceed 80 Character"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    lastName: {
        type: String,
        required: [true, "Please Enter Your Last Name"],
        minLength: [4, "Title must be at Least 4 Character"],
        maxLength: [80, "Title can't exceed 80 Character"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Password"],
        minLength: [4, "Title must be at Least 4 Character"],
        maxLength: [80, "Title can't exceed 80 Character"],
    },
    role: {
        type: String,
        require: true,
    },
    phoneNumber: {
        type: Number,
        minLength: 10,
        maxLength: 10,
        unique: true
    },
    subjectType: {
        type: [mongoose.Schema.Types.ObjectId],
        // required: true,
        ref: "subject"
    }
}, { timestamps: true })

const userModel = mongoose.model("user", schema)
module.exports = userModel