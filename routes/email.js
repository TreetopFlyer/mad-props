var router = require('express').Router();
var db = require('../db/neo4j');
var User = require('../db/user');
var Contest = require('../db/contest');
var Story = require('../db/story');
var uuid = require('uuid');
var nodemailer = require('nodemailer');

router.use('/email', function(inReq, inRes, inNext){
    if(!inReq.Auth.LoggedIn){
        inRes.status(500).json({exception:'you are not authorized to do this'});
        return;
    }else{
        inNext();
    }
});

module.exports = router;