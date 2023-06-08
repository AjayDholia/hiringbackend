const subjectModel = require("../Models/subjectModel")
// Create Subject Api
exports.createSubject = async (req, res, next) => {
    try {
        const { subjectName } = req.body;
        if (!subjectName) {
            throw "fill the Subject Name First"
        }
        await subjectModel.create({
            subjectName: subjectName
        })
        res.status(200).json({
            success: true,
            message: "Subject Has Been Added SuccessFully",
            status: 200
        })
    }
    catch (err) {
        let error = null
        if (err.message.code === 11000) {
            error = "duplicate Name Can't  Store"
        }
        res.status(400).json({
            success: 'fail',
            message: error || err,
            status: 400
        })
    }
}

// get All Subject Api
exports.getAllSubject = async (req, res, next) => {
    try {
        console.log('here')
        const allDataofSubject = await subjectModel.find();
        console.log(allDataofSubject, 'allDataofSubject');
        if (allDataofSubject.length === 0) {
            res.status(400).json({
                message: "No Data Available",
                success:false
            })
        }
        else {
            res.status(200).json({
                data: allDataofSubject,
                message: "Subject Data Available",
                success:true
            })
        }

    }
    catch (err) {
        console.log('error catch',err)
        res.status(400).json({
            error: err,
            success:false
        })
    }

}

// edit subject name api
exports.editSubject = async (req, res, next) => {
    try {
        const { subjectName, subjectId } = req.body;

        if (subjectName.length === 0 && !subjectName) {
            res.status(500).json({
                message: "please Send The Data First",
                success:false
            })
        }
        await subjectModel.findOneAndUpdate({ _id: subjectId }, { subjectName })

        res.status(201).json({
            message: "Subject Name Updated SuccessFully",
            success:true
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
            success:false
        })
    }
}

// delete single subject
exports.deleteSubject = async (req, res, next) => {

    try {
        const { subjectId } = req.query;
        if (!subjectId) {
      return res.status(409).json({
        message:"please send required field",
        success:false
      })
        }
        const deletedSubject = await subjectModel.findByIdAndRemove({ _id: subjectId })

        if (!deletedSubject) {
            return res.status(409).json({
                message:"No Subject Found In DataBase For this Name",
                success:false
              })
        }

        res.status(201).json({
            message: "Subject Deleted SuccessFully",
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


