var router = require('express').Router();
var Auth = require('../classes/Auth');
var User = require('../db/user');

router.get('/auth/hack/:identity', function(inReq, inRes){
    var fixed = unescape(inReq.params.identity);
    inRes.redirect("/auth/login/?identity="+fixed+"&signature="+Auth.Sign(fixed));
});

router.get('/auth/login', function(inReq, inRes){

    var fixed;

    if(inReq.Auth.LoggedIn){
        inRes.redirect('/');
        return;
    }

    if(!inReq.query.identity || !inReq.query.signature){
        inRes.send("credentials not supplied correctly");
        return;
    }

    fixed =  unescape(inReq.query.identity);

    if(!Auth.Verify(fixed, inReq.query.signature)){
        inRes.send("credentials are incorrectly signed. Should be---> "+ Auth.Sign(fixed)+"   instead of--->"+ inReq.query.signature);
        return;
    }

    User
    .locate({id:fixed})
    .then(function(inData){
        if(inData.length == 0){
            inRes.send("account not on record");
        }else{
            inReq.Auth.LogIn(fixed, inReq.query.signature);
            inRes.redirect('/you');
        }
    }, function(inError){
        inRes.send(inError);
    }).catch(function(inError){
        inRes.send(inError);
    })
});

router.get('/auth/logout', function(inReq, inRes){
    if(inReq.Auth.LoggedIn){
        inReq.Auth.LogOut();
    }
    inRes.redirect('/');
});

module.exports = router;