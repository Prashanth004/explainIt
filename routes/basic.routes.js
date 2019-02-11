const express = require('express');
const router = express.Router();



router.get('/',function(req,res){
    res.render('home.ejs')
});
router.get('/privacyPolicy',function(req,res){
    res.render('privacy.ejs')
});

module.exports = router;