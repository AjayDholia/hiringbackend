const express = require("express");
const {CreateUser,getAllUsers,deleteUser,sendMessageToPhone,userLogin,editUsers} = require("../Controllers/users")
const{approveParticipantSubject} = require("../Controllers/participant")
const router = express.Router();

router.route("/createuser").post(CreateUser) 
router.route("/getalluser").get(getAllUsers)
router.route("/login").post(userLogin)
router.route("/deleteuser").post(deleteUser)
router.route("/approvesubject").post(approveParticipantSubject)
router.route("/message").get(sendMessageToPhone)
router.route("/edit").post(editUsers)
module.exports = router