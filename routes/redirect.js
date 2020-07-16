var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    const data = new Date().getTime();
    //res.send('respond with a resource inside users');
    res.set('Cache-Control', 'no-store,must-revalidate');
    var dateToSet = new Date();
    dateToSet.setDate(dateToSet.getDate() + 50);
    // res.set('Expires', dateToSet.toUTCString());
    res.render('pages/redirect', { 'randomNumber': data });
});

module.exports = router;