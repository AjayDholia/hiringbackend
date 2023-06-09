const participantModel = require("../Models/participantModel");
const otpModel = require("../Models/otpModel");
const sampleModel = require("../Models/sampleModel");
const Subject = require("../Models/subjectModel");
const nodemailer = require("nodemailer");
var ObjectId = require("mongodb").ObjectId;
exports.createParticipant = async (req, res, next) => {
  try {
    const { name, lastName, phoneNumber, email, experience, resume } = req.body;

    if (
      !name ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !experience 
      ||
      !resume
    ) {
      return res.status(200).json({
        message: "Please Send Required Field",
        success: false,
      });
    }
    var userData = await participantModel.create({
      name,
      lastName,
      phoneNumber,
      email,
      experience,
      resume,
    });

    const mailOTP = await sendMail({ name, lastName, email });

    var UploadfileData;
    console.log(userData, "userData");
    if (userData) {
      UploadfileData = await sampleModel.create({
        userName: userData._id,
      });
    }
    userData = await participantModel.findByIdAndUpdate(
      { _id: userData._id },
      {
        $set: { samples: UploadfileData._id },
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Participant Created Successfully",
      user: userData,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
const sendMail = async ({ name, lastName, email }) => {
  const generatedOtp = await GenrateOtp();

  let isAvailable = await otpModel.findOne({ email: email });
  let setOTP = null;
  if (isAvailable) {
    setOTP = await otpModel.findOneAndUpdate(
      { email: email },
      { $set: { otpData: generatedOtp } }
    );
  } else {
    setOTP = await otpModel.create({
      name,
      lastName,
      email: email,
      otpData: generatedOtp,
    });
  }

  console.log(setOTP, "setOTP");

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "hiringapp8@gmail.com",
      pass: "fmgxybgbtgrehykp",
    },
  });

  let info = await transporter.sendMail({
    from: '"Hiring Team" <hiringapp8@gmail.com>', // sender address
    to: [email], // list of receivers
    subject: "Otp to Verify Your Mail Id", // Subject line
    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Writlance Services</a>
      </div>
      <p style="font-size:1.1em">Hello ${name || setOTP.name} ${lastName || setOTP.lastName
      }, <b>YOUR OTP</b> for registration on Writlance Service is</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${generatedOtp}</h2>
      <p style="font-size:0.9em;">Thanks and Regards <br/>Writlance Services</p>
    </div>
  </div>`,
  });

  return info;
  // res.json({
  //     message: "Mail has Been Sended SuccessFully",
  //     response: true
  // })
};

const GenrateOtp = async () => {
  let digit = "0123456789";
  var OTP = "";

  for (let i = 0; i < 6; i++) {
    OTP += digit[Math.floor(Math.random() * 10)];
  }

  return OTP;
};

exports.getParticipantSubject = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      returnres.status(400).json({
        message: "User id Not Found",
        success: false,
      });
    }

    // const data = await participantModel.findOne({_id:userId},{subject:1}).populate('subject')
    const data = await participantModel.findOne({ _id: userId }).populate({
      path: "samples",
      populate: {
        path: "subjectData",
        model: "samples",
        populate: {
          path: "subject",
          model: "subject",
        },
      },
    });
    // .populate('samples.subjectData.subject')
    if (!data) {
      return res.status(200).json({
        message: "No Data Found",
        success: true,
        data: data,
      });
    }

    res.status(200).json({
      message: data,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};
exports.deleteParticipant = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (id.length === 0) {
      return res.status(409).json({
        message: "Please Send ID first",
        status: false,
      });
    }

    const isFound = await participantModel.findOneAndRemove({ _id: id });
    if (isFound.length === 0) {
      // throw
      return res.status(409).json({
        message: "No Participend Found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Participent Deleted Successfully",
      success: true,
    });
  } catch (err) {
    res.status(409).json({
      message: err.message,
      success: false,
    });
  }
};

exports.getAllParticipant = async (req, res, next) => {
  try {
    // const page = 1
    // const limit = 10

    // let skip = (page - 1) * limit;

    // const AllParticipantModel = await participantModel.find({}).skip(skip).limit(limit).sort({ "createdAt": -1 }).populate('subject');
    const AllParticipantModel = await participantModel
      .find({})
      .sort({ createdAt: -1 })
      .populate("subject")
      .populate("review.subject")
      .populate("review.reviewBy")
      .populate({
        path: "samples",
        populate: {
          path: "subjectData",
          model: "samples",
          populate: {
            path: "subject",
            model: "subject",
          },
        },
      });
    if (AllParticipantModel.length === 0) {
      res.status(200).json({
        message: "No Participent Data Available",
        success: true,
      });
    }
    res.status(200).json({
      data: AllParticipantModel,
      message: "All Participent Data Available",
      success: true,
    });
  } catch (err) {
    res.status(400).json({
      error: err,
      success: false,
    });
  }
};

exports.getSingleParticipant = async (req, res, next) => {
  try {
    const { id } = req.body;

    if (id.length === 0 && !id) {
      res.status(409).json({
        message: "Please Send ID first",
        success: false,
      });
    }
    const user = await participantModel.findById({ _id: id });

    if (user.length === 0) {
      return res.status(409).json({
        message: "No Participend Found",
        success: false,
      });
    }

    res.status(200).json({
      Data: user,
      success: true,
    });
  } catch (err) {
    res.status(409).json({
      message: err.message,
      success: false,
    });
  }
};

exports.FilterParticipentBySubject = async (req, res, next) => {
  try {
    const { subject } = req.body;

    if (subject.length === 0) {
      return res.status(404).json({
        message: "Does't Support Blank Array",
        success: false,
      });
    }

    let FilterParticipant = await participantModel.aggregate([
      {
        $lookup: {
          from: "subjects",
          localField: "subject",
          foreignField: "_id",
          as: "subject",
        },
      },
      {
        $lookup: {
          from: "samples",
          localField: "samples",
          foreignField: "_id",
          as: "sample",
        },
      },
      {
        $match: {
          "subject.subjectName": { $in: subject },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({
      success: true,
      // data: filterParticipantbysubject
      data: FilterParticipant,
      dataCount: FilterParticipant.length,
    });
  } catch (err) {
    res.status(404).json({
      message: err.message,
      success: false,
    });
  }
};

exports.FilterParticipantByYears = async (req, res, next) => {
  try {
    const { year } = req.body;

    if (!year) {
      return res.status(301).json({
        message: "No data Send By front end",
        success: false,
      });
    }

    const AllData = await participantModel.find({ experience: year });

    res.status(200).json({
      success: true,
      data: AllData,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
      success: false,
    });
  }
};

exports.SearchByName = async (req, res, next) => {
  try {
    const { search } = req.body;

    if (search === undefined) {
      throw "Empty value Not Acceptable";
    }

    const response = await participantModel.aggregate([
      {
        $lookup: {
          from: "subjects",
          localField: "subject",
          foreignField: "_id",
          as: "subject",
        },
      },
      {
        $match: {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phoneNumber: { $regex: search, $options: "i" } },
            { "subject.subjectName": { $regex: search, $options: "i" } },
          ],
        },
      },
    ]);

    res.status(200).json({
      message: "data Found SuccessFully",
      data: response,
      status: true,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
      status: false,
    });
  }
};

exports.approveParticipantSubject = async (req, res, next) => {
  try {
    const { subjectId, participantId, reviewBy, status, message } = req.body;
    const IsUserFound = await participantModel.findOne(
      { _id: participantId },
      { "review.reviewBy": reviewBy }
    );

    if (!IsUserFound) {
      return res.status(400).json({
        message: "No User Found With This participant Id",
        success: false,
      });
    }

    const isAlreadyReview = await participantModel.findOne(
      { $and: [{ _id: participantId }, { 'review.reviewBy': reviewBy }, { 'review.subject': subjectId }] }
    )

    let data = null
    if (!isAlreadyReview) {

      data = await participantModel.findOneAndUpdate(
        { _id: participantId },
        {
          $push: {
            review: {
              subject: subjectId,
              reviewBy: reviewBy,
              isApproved: status,
              message: message,
            },
          },
        }
      );
    } else {
      let oldReview = isAlreadyReview.review;
    console.log("isAlreadyReview.review",isAlreadyReview.review);
      let myObject = oldReview.find((e) => e.subject.toString() == subjectId)

      myObject = {
        ...myObject._doc, isApproved: status
      }
console.log("myObject",myObject);


console.log("oldReview",oldReview)
      let myNewData = oldReview.filter((e) => e.subject.toString() !== subjectId)
    myNewData.push(myObject)

      console.log("MYnewData",myNewData);

  data = await participantModel.findOneAndUpdate(
    { _id: participantId },
    {
      $set: {
        review: myNewData
      },
    }
  );
      console.log("data",data)

    }



    if (!data) {
      return res.status(400).json({
        message: `subject Approved ${status} SuccessFully`,
        success: `${status}`,
      });
    }
    res.status(201).json({
      message: `subject Approved ${status} SuccessFully`,
      success: `${status}`,
    });

    let Pending = 0;
    let Approved = 0;
    let Reject = 0;

    const AllData = await participantModel.find(
      { _id: participantId },
      { review: 1 }
    );
    console.log(AllData[0].review, "AllData");
    const filterData = AllData[0].review.map((data, index) => {
      console.log(data, "data ");
      if (data.isApproved === "true") {
        Approved += 1;
      } else if (data.isApproved === "false") {
        Reject += 1;
      } else {
        Pending += 1;
      }
    });

    if (Approved > 0) {
      await participantModel.findByIdAndUpdate(
        { _id: participantId },
        { status: "Approved" }
      );
    } else {
      if (Pending > Reject) {
        await participantModel.findByIdAndUpdate(
          { _id: participantId },
          { status: "pending" }
        );
      } else {
        await participantModel.findByIdAndUpdate(
          { _id: participantId },
          { status: "reject" }
        );
      }
    }
    console.log("pending", Pending, "Approved", Approved, "Reject", Reject);
  } catch (err) {
    res.status(401).json({
      message: err.message,
      success: false,
    });
  }
};

exports.getAllApprovedsubjectofuser = async (req, res, next) => {
  try {
    const { participantId } = req.body;

    const ReviewData = await participantModel
      .find({ _id: participantId }, { review: 1 })
      .populate("review.subject")
      .populate("review.reviewBy");

    if (!ReviewData) {
      return res.status(400).json({
        message: "No Data Available",
        success: false,
      });
    }

    res.status(200).json({
      data: ReviewData,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      status: false,
    });
  }
};

exports.addSubjectInPatricipant = async (req, res, next) => {
  try {
    const { subjectId, userId } = req.body;

    if (!subjectId && !userId) {
      return res.status(400).json({
        message: "please Send subjectid and userid first",
        success: false,
      });
    }

    const IsuserFound = await participantModel.findOne({
      _id: userId,
      subject: { $in: [subjectId] },
    });
    if (IsuserFound) {
      return res.status(404).json({
        success: false,
        message: "subject already present",
      });
    }

    //update the subject if that is not available in the list
    const addSubject = await participantModel.findOneAndUpdate(
      { _id: userId },
      { $push: { subject: subjectId } },
      { new: true }
    );

    if (!addSubject) {
      return res.status(400).json({
        success: false,
        message: "Not added",
      });
    }
    res.status(201).json({
      success: true,
      message: "SUBJECT ADDED",
      data: addSubject,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
      success: false,
    });
  }
};

exports.removeSubjectInParticipant = async (req, res, next) => {
  try {
    var { userId, subjectId } = req.query;
    console.log(userId, subjectId);

    userId = new ObjectId(userId);

    if (!subjectId && !userId) {
      return res.status(400).json({
        message: "please Send subjectid and userid first",
        success: false,
      });
    }
    const RemoveSubject = await participantModel
      .findOneAndUpdate(
        { _id: userId },
        { $pull: { subject: subjectId } },
        { new: true }
      )
      .populate("subject");

    UploadfileData = await sampleModel.findOneAndUpdate(
      { userName: userId },
      { $pull: { subjectData: { subject: subjectId } } },
      { new: true }
    );
    if (RemoveSubject) {
      return res.status(200).json({
        success: true,
        message: "subject Deleted SucessFully",
        data: RemoveSubject,
      });
    }
  } catch (err) {
    return res.status(409).json({
      success: false,
      message: err.message,
    });
  }
};

exports.VerifyParticipant = async (req, res, next) => {
  try {
    const { email, OTP } = req.body;

    if (!email || !OTP) {
      res.status(400).json({
        message: "Please Send All Required Field",
        success: false,
      });
    }

    const VerifyParticipant = await otpModel.findOne({
      email: email,
      otpData: OTP,
    });

    if (!VerifyParticipant) {
      return res.status(400).json({
        message: "Wrong Otp",
        success: false,
      });
    }

    res.status(200).json({
      message: "Verify SuccessFully",
      success: true,
    });
  } catch (error) { }
};

exports.ResendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "please send email first",
        success: false,
      });
    }

    const data = await sendMail({ email });
    console.log(data, "data");

    if (!data) {
      return res.status(400).json({
        message: "Email not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Otp Resend SuccessFully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};
