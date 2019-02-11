const express = require('express');
const router =  express.Router();
const tech =  require('../controller/tech.query');
const bodyParser = require('body-parser');



router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
router.use('/:name', tech.getSingleTechMiddle);
router.get('/:name', tech.getSingleTech);
router.post('/', tech.createTech)

module.exports = router;