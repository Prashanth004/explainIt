var express = require('express');
var router = express.Router();
var admin = require('../controller/admin')

router.post('./dash',admin.authenticateAdmin)
module.exports = router;