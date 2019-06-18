var express = require('express');
var router = express.Router();
const passport = require('passport');
var referral = require('../controller/referral')


router.post('/',passport.authenticate('jwt', { session: false }),referral.createReferral);
router.get('/',passport.authenticate('jwt', { session: false }), referral.gatAllReferral);
router.get('/:referralid',passport.authenticate('jwt', { session: false }),referral.getReferralById);
// router.delete('/:referralid',passport.authenticate('jwt', { session: false }),referral.deleteById);
// router.put('/:referralid',passport.authenticate('jwt', { session: false }),referral.changeReferralById);

module.exports = router;