var router = require('express').Router();
var User = require('../db/user');
var Contest = require('../db/contest');
var uuid = require('uuid');

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
    .create({
        id:uuid.v1(),
        name: inReq.body.name,
        title: inReq.body.title,
        rank:inReq.body.rank
    })
    .then(function(inSuccess){
        inRes.json(inSuccess);
    }, function(inFailure){
        inRes.json(inFailure);
    })
    .catch(function(inError){
        inRes.json(inError);
    });
});
router.put('/admin/user', function(inReq, inRes){
    User
    .update({
        id:inReq.body.id,
        fields:{
            name: inReq.body.name,
            title: inReq.body.title,
            rank:inReq.body.rank
        }
    })
    .then(function(inSuccess){
        inRes.json(inSuccess);
    }, function(inFailure){
        inRes.json(inFailure);
    })
    .catch(function(inError){
        inRes.json(inError);
    });
});
router.delete('/admin/user', function(inReq, inRes){
    User
    .delete({
        id:inReq.body.id
    })
    .then(function(inSuccess){
        inRes.json(inSuccess);
    }, function(inFailure){
        inRes.json(inFailure);
    })
    .catch(function(inError){
        inRes.json(inError);
    });
});

router.post('/admin/contest', function(inReq, inRes){
    Contest
    .create({
        id:uuid.v1(),
        name:inReq.body.name,
        open:inReq.body.open
    })
    .then(function(inSuccess){
        inRes.json(inSuccess);
    }, function(inFailure){
        inRes.json(inFailure);
    })
    .catch(function(inError){
        inRes.json(inError);
    });
});
router.put('/admin/contest', function(inReq, inRes){
    Contest
    .update({
        id:inReq.body.id,
        fields:{
            name:inReq.body.name,
            open:inReq.body.open
        }
    })
    .then(function(inSuccess){
        inRes.json(inSuccess);
    }, function(inFailure){
        inRes.json(inFailure);
    })
    .catch(function(inError){
        inRes.json(inError);
    });
});
router.delete('/admin/contest', function(inReq, inRes){
    Contest
    .delete({
        id:inReq.body.id
    })
    .then(function(inSuccess){
        inRes.json(inSuccess);
    }, function(inFailure){
        inRes.json(inFailure);
    })
    .catch(function(inError){
        inRes.json(inError);
    });
});

module.exports = router;