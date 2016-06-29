var router = require('express').Router();
var Auth = require('../classes/Auth');
var neo4j = require('../db/neo4j');

router.get('/hack/:email', function(inReq, inRes){
    var fixed = unescape(inReq.params.email);
    inRes.send("http://localhost/login/?email="+fixed+"&signature="+Auth.Sign(fixed));
});

router.get('/login', function(inReq, inRes){

    var fixed;

    if(inReq.Auth.LoggedIn){
        inRes.redirect('/');
        return;
    }

    if(!inReq.query.email || !inReq.query.signature){
        inRes.send("credentials not supplied correctly");
        return;
    }

    fixed =  unescape(inReq.query.email);
    if(!Auth.Verify(fixed, inReq.query.signature)){
        inRes.send("credentials are incorrectly signed. Should be---> "+ Auth.Sign(fixed)+"   instead of--->"+ inReq.query.signature);
        return;
    }

    neo4j
    .query("match (u:User {identity:{userEmail}}) return u", {userEmail:fixed})
    .then(function(inData){
        if(inData.length == 0){
            inRes.send("account not on record");
        }else{
            inReq.Auth.LogIn(fixed, inReq.query.signature);
            inRes.redirect('/you');
        }
        return Promise.resolve({});
    }, function(inError){
        inRes.send(inError);
    });
});

router.get('/logout', function(inReq, inRes){
    if(inReq.Auth.LoggedIn){
        inReq.Auth.LogOut();
    }
    inRes.redirect('/');
});

module.exports = router;