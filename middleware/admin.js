var router = require('express').Router();
var User = require('../db/user');

router.use('/admin', function(inReq, inRes, inNext){

    if(!inReq.Auth.LoggedIn){
        inRes.json({exception:'you are not authorized to do this'});
        return;
    }
    User
    .locate({id:inReq.Auth.ID})
    .then(function(inSuccess){
        if(inSuccess.rank == "admin"){
            inNext();
        }else{
            inRes.json({exception:'you are not admin rank'});
        }
    }, function(inFailure){
        inRes.json({exception:'you are not authorized to do this'});
    }).catch(function(inError){
        inRes.json({exception:'error accessing profile'});
    });

});

router.post('/admin/user', function(inReq, inRes){

    User
    .locate({identity:inReq.body.identity})
    .then(function(inSuccess){
        inRes.json({exception:"user already exists"});
    }, function(inFailure){
        return User.create({
            id:inReq.body.id,
            name: inReq.body.name,
            title: inReq.body.title,
            rank:inReq.body.rank
        });
    })
    .then(function(inSuccess){
        inRes.json(inSuccess);
    }).catch(function(inError){
        inRes.json(inError);
    });

});

module.exports = router;