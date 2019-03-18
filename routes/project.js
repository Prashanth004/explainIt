var express = require('express');
var router = express.Router();
var project = require('../controller/project')
const passport = require('passport');
require('../config/passport')(passport)
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/audio');
    },
    filename :  function(req, file, cb){
        cb(null, req.body.projectName+'.mp4')
    } 
})
// const fileFilter = (req, file, cb)=>{
// if( file.mimetype === 'vide/wav' || file.mimetype === 'audio/mp3 '){
//  cb(null, true);
// }
// else{
//     cb(null, false);
// }
// }


const upload =  multer({
    storage:storage, 
    // limits:{
    //     fileSize : 1024 * 1025 * 12 
    // }  
})

router.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
   });
   
   router.use('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
   });
   
// 

router.post('/',upload.single('audioData'), passport.authenticate('jwt', { session: false }), project.saveProject)
router.delete('/:issueid', passport.authenticate('jwt', { session: false }),project.deleteItems )
router.get('/',project.getAllProject)
router.get('/:id', passport.authenticate('jwt', { session: false }),project.getProjectById)
// router.get('/issue/allissues/', passport.authenticate('jwt', { session: false }),project.getIssueProjects)
router.get('/issues/:issueid',project.getAllProjectByIssue)
router.post('/items', passport.authenticate('jwt', { session: false }), project.storeItems)
router.get('/items/:id', passport.authenticate('jwt', { session: false }), project.retrieveItems)


module.exports = router;
