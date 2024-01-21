const dotenv = require("dotenv")
const connectToDb = require("./config")
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt  = require('jsonwebtoken');
const multer = require('multer');
const path = require("path");
const cors = require("cors")
const productRoute = require("./route/productRoute");

dotenv.config()
app.use(express.json());
app.use(cors());

const port = process.env.PORT;



//API test
app.get("/", (req, res)=> {
    res.send("express app is running")
})
// route middile ware
app.use('/products', productRoute);

//image  Storage
const storage = multer.diskStorage({
    destination: "./upload/images",
    filename: (req, file, cb) => {
     return    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage:storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB upload limit
      },
})

//Creating upload endpoint images
app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res)=> {
    res.json({
        succes:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })

})

app.listen(port, (error)=> {
    if(!error ){
        console.log("Server Running on"+" " + port)
    }
    else{
        console.log("Error :" + error)
    }

})