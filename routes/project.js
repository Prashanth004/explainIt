var express = require('express');
var router = express.Router();
var project = require('../controller/project')
const passport = require('passport');
require('../config/passport')(passport)
const upload = require('../controller/fileOperation')


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

   

router.use('/file',passport.authenticate('jwt', { session: false }),upload.handleFiles)


router.put('/edittext',passport.authenticate('jwt', { session: false }),project.editReason )
router.post('/file', passport.authenticate('jwt', { session: false }), project.saveProject)
router.delete('/:issueid', passport.authenticate('jwt', { session: false }),project.deleteItems )
router.get('/',project.getAllProject)
router.get('/project/:id', passport.authenticate('jwt', { session: false }),project.getProjectById)

router.get('/:id', passport.authenticate('jwt', { session: false }),project.getIssueById)
// router.get('/issue/allissues/', passport.authenticate('jwt', { session: false }),project.getIssueProjects)
router.get('/issues/:issueid',project.getAllProjectByIssue)
router.post('/items', passport.authenticate('jwt', { session: false }), project.storeItems)
router.get('/items/:id', passport.authenticate('jwt', { session: false }), project.retrieveItems)
router.put('/public',passport.authenticate('jwt', { session: false }), project.updateProjectpublic)
router.put('/private',passport.authenticate('jwt', { session: false }), project.updateProjectprivate)
module.exports = router;
