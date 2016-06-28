var router = require('express').Router();
var Auth = require('../classes/Auth');

router.get('/hack', function(inReq, inRes){
    inRes.send("localhost:/login/?email="+inReq.query.email+"&signature="+Auth.Sign(inReq.query.email));
});

router.get('/login', function(inReq, inRes){

    if(inReq.Auth.LoggedIn){
        inRes.send("you are alreday logged in");
        return;
    }

    if(!inReq.query.email || !inReq.query.signature){
        inRes.send("credentials not supplied correctly");
        return;
    }

    if(!Auth.Verify(inReq.query.email, inReq.query.signature)){
        inRes.send("credentials are incorrectly signed");
        return;
    }

    inReq.Auth.LogIn(inReq.query.email, inReq.query.signature);
    inRes.redirect('/');
    return;
});

router.get('/logout', function(inReq, inRes){

    if(inReq.Auth.LoggedIn){
        inReq.Auth.LogOut();
    }

    inRes.redirect('/');
});

module.exports = router;