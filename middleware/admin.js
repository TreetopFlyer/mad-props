var router = require('express').Router();
var User = require('../db/user');

router.use('/admin', function(inReq, inRes, inNext){

    if(!inReq.Auth.LoggedIn){
        inRes.json({exception:'you are not authorized to do this'});
        return;
    }

    User
    .find({identity:inReq.Auth.ID})
    .then(function(inSuccess){
        if(inSuccess.rank == "admin"){
            inNext();
        }else{
            inRes.json({exception:'you are not admin rank'});
        }
    }, function(inFailure){
        inRes.json({exception:'you are not authorized to do this'});
    });

});

router.post('/admin/user', function(inReq, inRes){

    User.find({identity:inReq.body.identity})
    .then(function(inSuccess){
        inRes.json({exception:"user already exists"});
    }, function(inFailure){
        return User.create({
            identity:inReq.body.identity,
            name: inReq.body.name,
            title: inReq.body.title,
            rank:inReq.body.rank
        });
    })
    .then(function(inSuccess){
        inRes.json(inSuccess);
    }, function(inError){
        inRes.json({exception:"error creating user"});
    });

});

module.exports = router;