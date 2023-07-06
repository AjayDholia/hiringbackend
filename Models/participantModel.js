const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name"],
        // minLength: [4, "Title must be at Least 4 Character"],
        maxLength: [80, "Title can't exceed 80 Character"],
    },
    lastName: {
        type: String,
        required: [true, "Please Enter Your Last Name"],
        // minLength: [4, "Title must be at Least 4 Character"],
        maxLength: [80, "Title can't exceed 80 Character"],
    },
    samples: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'sample',
    },
    subject: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: 'subject',
    },
    phoneNumber: {
        type: String,
        minLength: 10,
        maxLength: 10,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        required: true,
    },
    resume: {
        type: String,
        required:true,
    },
    status: {
        type: String,
        default:'Pending'
    },
    review: [
        {
            subject: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'subject'
            },
            isApproved: String,
            reviewBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            message: String
        }
    ]
}, { timestamps: true })


const participantModel = mongoose.model("participant", schema);
module.exports = participantModel