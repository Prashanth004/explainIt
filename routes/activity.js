var express = require('express');
var router = express.Router();
const passport = require('passport');
var activityController=require('../controller/activity')

router.get('/user',passport.authenticate('jwt', { session: false }),activityController.getAcitivies)
router.post('/',passport.authenticate('jwt', { session: false }), activityController.addActivity);
router.get('/all',passport.authenticate('jwt', { session: false }), activityController.getAllActivities);
router.delete('/:id',passport.authenticate('jwt', { session: false }),activityController.deleteActivity);

module.exports = router;
