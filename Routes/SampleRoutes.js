const express = require("express");
const {UploadFile,DeleteFile, AddFile,getAllfile,AddSampleSubject} = require("../Controllers/sample")
const router = express.Router();

// router.route("/uploadfile").post(UploadFile);
router.route("/deletefile").post(DeleteFile);
router.route("/getallfile").post(getAllfile);
router.route("/addfile").post(AddFile);
router.route("/addsamplesubject").put(AddSampleSubject)

module.exports = router