const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  otpData: {
    type: Number,
    required: true,
  },
  email : {
    type : String,
    unique:true
  },
  expireAt : {
    type : Date,
    default : Date.now,
    index : {expires : 300}
  }
}, { timestamps: true })

//

const otpModel = mongoose.model("otp", schema);
module.exports = otpModel