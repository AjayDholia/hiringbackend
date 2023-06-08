const userModel = require("../Models/UserModel");
// const twilio = require('twilio')(process.env.SID,process.env.AUTH_TOKEN)
const bcrypt = require("bcrypt")

exports.CreateUser = async (req, res, next) => {

    try {
        const { name, lastName, email, password, role, phoneNumber, subjectType } = req.body;

        if( !name || !lastName || !email || !password || !role || !phoneNumber || !subjectType )
        {
            return res.status(400).json({
                message:"Please Send All Field",
                success:false
            })
        }

    //     const salt = await bcrypt.genSalt(10);
    // const secPass = await bcrypt.hash(password,salt);

      const user = await userModel.create({
            name,
            lastName,
            email,
        //    password: secPass,
        password,
            role,
            phoneNumber,
            subjectType
        })

        res.status(200).json({
            message: "QC User Created Successfully",
            success: true,
            status: 200
        })

    }
    catch (err) {
        if (err.code === 11000) {
            res.status(409).json({
                success:false,
                error: "User already exist!!"
            })
        }
        else {
            res.status(500).json({
                success:false,
                error: err.message
            })
        }
    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
     
        const isUserFound = await userModel.find().populate('subjectType');
        if (!isUserFound) {
          return res.status.josn({
            message:"No Data Available",
            success:false
          })
        }
        res.status(200).json({
            Data: isUserFound,
            success:true
        })
    }
    catch (err) {
        res.status(400).json({
            message: err.message,
            success:false
        })
    }
}

exports.deleteUser = async (req, res, next) => {
    try {

        const { userId } = req.query;
        if (!userId) {
          return res.status(400).json({
            message:"please send required Field",
            success:false
          })
        }
        const deleteUser = await userModel.findByIdAndRemove({ _id: userId })
        console.log(deleteUser, "deleteuser");

        if (!deleteUser) {
            return res.status(400).json({
                message:"No Qc Found In DataBase For this Name",
                success:false
              }) 
        }

        res.status(201).json({
            message: "QC Deleted SuccessFully",
            success:true
        })
    }
    catch (err) {
        res.status(400).json({
            message: err.message,
            success: false
        })
    }
}




exports.editUsers = async(req,res,next)=>{
    try{

        const {userId,name,lastName,password,email,phoneNumber,subjectType}= req.body;

    const user = await userModel.findOneAndUpdate({_id:userId},{ name:name,lastName:lastName,password:password,email:email,phoneNumber:phoneNumber,subjectType:subjectType} ,{new:true})
if(!user){
return res.status(400).json({
    message:"user Not Available for this id",
    success:false
})
}
res.status(200).json({
    message:"user Updated Successfully",
    success:true,
    data:user
})
    }
    catch(error){
        res.status(400).json({
            message:error.message,
            success:false
        })
    }
}

exports.sendMessageToPhone = async(req,res,next)=>{

    // twilio.messages.create({
    //     from:"+13203318188",
    //     username:"ajay",
    //     to:"+918059070534",
    //     body:"this is a testing Message"
    // }).then((res)=>(console.log(res,'message has been send')))
    // .catch((e)=>(console.log(e,"e")))
}

exports.userLogin = async(req,res,next)=>{
 try{
    const {phoneNumber,password} = req.body

    if(!phoneNumber || !password){
        return res.status(400).json({
            message:"Phone Number Or Password required",
            success:false
        })
    }


    const user = await userModel.findOne({phoneNumber})

    console.log(user,"user data");
    if(!user){
        return res.status(400).json({
            message:"Phone Number or Password Wrong",
            success:false
        })
    }

    console.log(user.password , password , "password ");
    if(password !== user.password){
        return res.status(400).json({
                    message:"Password Must Match",
                    success:false
                })
    }
    //  const isPasswordMatch  = await bcrypt.compare(password,user.password);
    //  console.log(isPasswordMatch,"isPasswordMatch");
    // if(!isPasswordMatch){
    //    return res.status(400).json({
    //         message:"Password Must Match",
    //         success:false
    //     })
    // }


res.status(200).json({
    message:"Login Successfull",
    data:user,
    success:true
})

 }
 catch(err){
    res.status(400).josn({
        message:err.message,
        success:false
    })
 }
}


