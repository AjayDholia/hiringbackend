const express = require("express");
// const bodyParser = require("body-parser");
const morgan = require("morgan")
const cors = require("cors")
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const participantRouter = require("./Routes/ParticipantRoutes");
const subjectRouter = require("./Routes/SubjectRoutes");
const superAdminRoutes = require("./Routes/SuperAdminRoutes");
const sampleRouter = require('./Routes/SampleRoutes')
const uploadRoutes = require("./Routes/UploadRoutes");
const userRoutes = require("./Routes/UserRoutes")
const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded());
app.use(morgan('common'))
app.use(cors());

mongoose.connect(process.env.Mongo_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

.then(() => {
console.log('DataBase Connected Successfully')
})

.catch((error) => {
        console.log(error);
    })

app.listen(process.env.PORT, () => {
    console.log("the Server is Running on this Port", process.env.PORT);
})

// All Routes
app.use("/api/v1/participant", participantRouter,)
app.use("/api/v1/sample", sampleRouter)
app.use("/api/v1/subject", subjectRouter)
app.use("/api/v1/admin", superAdminRoutes)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/upload", uploadRoutes);




