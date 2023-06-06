const express = require("express");
const router = express.Router();
const azure = require("azure-storage");
const multer = require("multer");
const { Readable } = require("stream");
const connectionString = `DefaultEndpointsProtocol=https;AccountName=hiringapp;AccountKey=M6IwLwYDW2orKumKKeAfuQ+wmMoP3iLP8MTNzpYC08P8jrA7iaVis9uh6Te1vnFFE+nTfESrh/Ba+AStwOU9BQ==;EndpointSuffix=core.windows.net`;
const blobService = azure.createBlobService(connectionString);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/").post(upload.single("file"), (req, res) => {
  console.log(req);
  const containerName = "hiringappdata";
  const fileName = new Date().valueOf() + "_" + req.file.originalname;
  const fileData = req.file.buffer;
  const stream = Readable.from(fileData);
  // Create the container if it doesn't exist
  blobService.createContainerIfNotExists(
    containerName,
    { publicAccessLevel: "blob" },
    (error) => {
      if (error) {
        console.error("Error creating container:", error);
        res.status(500).send("Error creating container");
      } 
      else {
        // Upload the file to the container
        blobService.createBlockBlobFromStream(
          containerName,
          fileName,
          stream,
          fileData.length,
          (err, result, response) => {
            if (err) {
              console.error("Error uploading File:", err);
              res.status(500).send("Error uploading File");
            } else {
              const fileUrl = `https://hiringapp.blob.core.windows.net/${result.container}/${result.name}`;
              console.log("File URL:", fileUrl);
              console.log("File uploaded successfully.");
              res
                .status(200)
                .send({ msg: "File uploaded successfully", fileUrl });
            }
          }
        );
      }
    }
  );
});

module.exports = router;