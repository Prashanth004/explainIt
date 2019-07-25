const multer = require('multer');
const config =  require('../config/keys')

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/audio');
    },
    filename: function (req, file, callback) {
      console.log("file : ",file);
      console.log("req.body.projectName : ", req.body.projectName)
        callback(null, req.body.projectName + file.originalname);
    }
});


const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'video/mkv' || file.mimetype === 'audio/mp3') {
        cb(null, true)
    }
    else {
        cd(new Error(' not a valid mimeType'), false)
    }
}



var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1025 * config.MAX_UPLOAD_LIMIT
    }
}).array('videoData', 2)



exports.handleFiles = (req,res,next)=>{
  console.log("req.body : ",req.body)
upload(req, res, function (err) {
      if(err instanceof multer.MulterError){
        console.log("error happened ");
        if(err.code === "LIMIT_FILE_SIZE")
        res.status(config.ERROR_CODE_FILE_TOO_LARGE).send({
          success:0,
          error:err,
          errorCode : config.ERROR_CODE_FILE_TOO_LARGE
        })
        else{
          console.log("error : ",error)
          // res.status(500).send({
          //   success:0,
          //   error:err
          // })
        }
      }
      else if(err){
        console.log("error : ",err)
        // res.status(500).send({
        //   success:0,
        //   error:err
        // })
      }
      else{
        next()
      }
    })
  }


