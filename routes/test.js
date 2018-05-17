var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    var url = req.query.url;
    var name = req.query.name;
    console.log(url, name);
    res.render('test');
});

module.exports = router;
