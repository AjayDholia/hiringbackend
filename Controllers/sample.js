const sampleModel = require("../Models/sampleModel")
const participantModel = require("../Models/participantModel")
var ObjectId = require('mongodb').ObjectId;


exports.DeleteFile = async(req,res,next) =>{
 try{
    const {subjectDataId,fileUrl} = req.body;

    if(!subjectDataId) {
        return res.status(400).json({
            message:"Please Send All Required Field",
            status:false
        })
    }
    const IsUserFound = await sampleModel.findOneAndUpdate({"subjectData._id": subjectDataId}, { $pull :{"subjectData.$.file" :fileUrl }},{new:true})
    if(!IsUserFound){
     return res.status(400).json({
        message:"Does't Found Any User With That Id",
        status:false
     })
    }
    res.status(200).json({
        message:"file Deleted Successfully",
        status:true,
        data:IsUserFound
    })
 }
 catch(err){
    res.status(400).json({
        message:err.message,
        status:false
    })
 }
}


exports.AddSampleSubject = async(req,res,next) =>{

  try{
    const {subjectId,userId} = req.body;
    const IsUserAvailable = await sampleModel.findOne({userName:userId});

    var UploadfileData;
    var addSubject;
    if(IsUserAvailable){
        UploadfileData = await sampleModel.findByIdAndUpdate({_id : IsUserAvailable._id}, { $push : { subjectData : { subject : subjectId}}}, {new : true});

       addSubject = await participantModel.findOneAndUpdate({ _id: userId }, { $push: { subject: subjectId } }, { new: true });
    }

    res.status(200).json({
        message:"subject Added Successfully",
        status:true,
        data:UploadfileData
    })
  }
  catch(err){
    res.status(400).json({
        message:err.message,
        status:false
    })
  }
}

exports.AddFile = async(req,res,next)=>{


    try{
        const {FileUrl,subjectDataId} = req.body

        if(!FileUrl || !subjectDataId){
            return res.status(400).json({
                message:"Please Send All Required Field",
                status:false
            })
        }
    
        const IsFileAdded = await sampleModel.findOneAndUpdate({"subjectData._id": subjectDataId}, { $push :{"subjectData.$.file" : FileUrl }},{new:true});
    
        if(!IsFileAdded){
            return res.status(400).json({
                message:"Does't Found Any User With That Id",
                status:false
             })
        }
    
        res.status(200).json({
            message:"file Added Successfully",
            status:true,
            data:IsFileAdded
        })
    }
    catch(error){
        res.status(400).json({
            message:error.message,
            status:false
        })
    }

}


exports.getAllfile = async(req,res,next) =>{
    try{
         var {subjectDataId, userId} = req.body;
         subjectDataId = new ObjectId(subjectDataId);
        const IsFileAdded = await sampleModel.find({"subjectData._id": subjectDataId});
        // const IsFileAdded = await sampleModel.aggregate([
        //     {
        //         $match : {"subjectData._id": subjectDataId}
        //     },
        //     {
        //         $project : {
        //             subjectData : 1,
        //             _id : 0
        //         }
        //     },
        //     {
        //         $match : { "$subjectData._id" : subjectDataId}
        //     }
        // ]);

        console.log(IsFileAdded);
        if(!IsFileAdded){
            return res.status(400).json({
                message:"User Not Found",
                success:false
            })
        }

       res.status(200).json({
        message:"Data Send SuccessFully",
        success:true,
        data:IsFileAdded
       })
    }
    catch(error){
        return res.status(400).json({
            status:false,
            message:error.message
        })
    }
}