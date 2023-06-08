const express = require("express");
const {createParticipant,deleteParticipant,ResendOtp,getParticipantSubject,removeSubjectInParticipant,VerifyParticipant,getAllApprovedsubjectofuser,getAllParticipant,SearchByName,FilterParticipentBySubject,getSingleParticipant,approveParticipantSubject,FilterParticipantByYears,addSubjectInPatricipant} = require("../Controllers/participant")
const router = express.Router();

router.route("/createparticipent").post(createParticipant)
router.route("/deleteparticipent").delete(deleteParticipant)
router.route("/getallparticipant").get(getAllParticipant)
router.route("/subjectfilter").post(FilterParticipentBySubject)
router.route("/getsingleparticipant").post(getSingleParticipant)
router.route("/yearfilter").post(FilterParticipantByYears)
router.route("/search").post(SearchByName)
router.route("/addsubjectinparticipant").put(addSubjectInPatricipant)
router.route("/approvelist").post(getAllApprovedsubjectofuser)
router.route("/removesubjectinparticipant").delete(removeSubjectInParticipant)
router.route("/verify").post(VerifyParticipant)
router.route("/resend").post(ResendOtp)
router.route("/participantsubject").post(getParticipantSubject)
module.exports = router