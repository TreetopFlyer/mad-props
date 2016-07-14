var router = require('express').Router();
var Auth = require('../classes/Auth');
var db = require('../db/neo4j');

router.get('/auth/impersonate/:identity', function(inReq, inRes){

    inReq.Auth.LogOut();
    inReq.Auth.LogIn(inReq.params.identity, Auth.Sign(inReq.params.identity));
    inRes.status(200).json({authorization:Auth.Forge(inReq.params.identity), id:inReq.params.identity});

});

router.get('/auth', function(inReq, inRes){
    if(inReq.Auth.LoggedIn){
        inRes.status(200).json({message:"credentials are good"});
    }else{
        inRes.status(500).json({message:"bad signature"});
    }
});

router.post('/auth', function(inReq, inRes){

    if(inReq.Auth.LoggedIn){
        inRes.status(200).json({authorization:Auth.Forge(inReq.Auth.ID), id:inReq.Auth.ID});
        return;
    }

    if(!inReq.body.username || !inReq.body.password){
        inRes.status(500).json({message:"credentials not supplied correctly"});
        return;
    }

    db.query("match (u:User {name:{name}, password:{password}}) return u", {
        name:inReq.body.username,
        password:inReq.body.password
    })
    .then(function(inData){
        if(inData.length == 0){
            inRes.status(500).json({message:"account not on record"});
        }else{
            
            var id = inData[0][0].data.id;
            var signature = Auth.Sign(inData[0][0].data.id);

            inReq.Auth.LogIn(id, signature);
            inRes.status(200).json({
                authorization:Auth.Forge(id),
                id:id,
                name:inData[0][0].data.name,
                title:inData[0][0].data.title,
                rank:inData[0][0].data.rank
            });
        }
    }, function(inError){
        inRes.status(500).json(inError);
    }).catch(function(inError){
        inRes.status(500).json(inError);
    });

});
router.delete('/auth', function(inReq, inRes){
    if(inReq.Auth.LoggedIn){
        inReq.Auth.LogOut();
    }
    inRes.status(200).json({message:"logout success!"});
});


module.exports = router;