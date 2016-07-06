var router = require('express').Router();
var User = require('../db/user');
var Contest = require('../db/contest');
var Story = require('../db/story');
var uuid = require('uuid');

router.use('/user', function(inReq, inRes, inNext){
    if(!inReq.Auth.LoggedIn){
        inRes.json({exception:'you are not authorized to do this'});
        return;
    }else{
        inNext();
    }
});

router.post('/user/story', function(inReq, inRes){

});

module.exports = router;