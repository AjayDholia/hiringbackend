const userModel = require("../Models/UserModel")
exports.createSuperAdmin = async (req, res, next) => {
    try {
        const { name, lastName, email, password, role, phoneNumber } = req.body;
        await userModel.create({
            name,
            lastName,
            email,
            password,
            role,
            phoneNumber
        })

        if( !name || !lastName || !email || !password || !role || !phoneNumber )
        {
            return res.status(400).json({
                message:"Please Send All Field",
                success:false
            })
        }
        res.status(200).json({
            message: "Admin Created Successfully",
            success: true,
        })

    }
    catch (err) {

        res.status(400).json({
            message:err.message,
            success:false
        })
    }
}