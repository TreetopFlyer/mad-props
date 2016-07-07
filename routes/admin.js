var router = require('express').Router();

var db = require('../db/neo4j');
var User = require('../db/user');
var Contest = require('../db/contest');
var uuid = require('uuid');

router.use('/admin', function(inReq, inRes, inNext){
    if(!inReq.Auth.LoggedIn){
        inRes.status(200).json({exception:'you are not authorized to do this'});
        return;
    }

    User
    .locate({id:inReq.Auth.ID})
    .then(function(inSuccess){
        if(inSuccess.rank == "admin"){
            inNext();
        }else{
            inRes.status(200).json({exception:'you are not admin rank'});
        }
    }, function(inFailure){
        inRes.status(500).json({exception:'you are not authorized to do this'});
    }).catch(function(inError){
        inRes.status(500).json({exception:'error accessing profile'});
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
        inRes.status(200).json(inSuccess);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    })
    .catch(function(inError){
        inRes.status(500).json(inError);
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
        inRes.status(200).json(inSuccess);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    })
    .catch(function(inError){
        inRes.status(500).json(inError);
    });
});
router.delete('/admin/user', function(inReq, inRes){
    User
    .delete({
        id:inReq.body.id
    })
    .then(function(inSuccess){
        inRes.status(200).json(inSuccess);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    })
    .catch(function(inError){
        inRes.status(500).json(inError);
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
        inRes.status(200).json(inSuccess);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    })
    .catch(function(inError){
        inRes.status(500).json(inError);
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
        inRes.status(200).json(inSuccess);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    })
    .catch(function(inError){
        inRes.status(500).json(inError);
    });
});
router.delete('/admin/contest', function(inReq, inRes){
    Contest
    .delete({
        id:inReq.body.id
    })
    .then(function(inSuccess){
        inRes.status(200).json(inSuccess);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    })
    .catch(function(inError){
        inRes.status(500).json(inError);
    });
});

router.post('/admin/award', function(inReq, inRes){
    db.query("match (c:Contest {id:{id}}) optional match (s:Story {id:{idStory}}) merge (c)-[:award]-(s) return s", {
        id:inReq.body.id,
        idStory:inReq.body.idStory
    })
    .then(function(inSuccess){
        inRes.status(200).json(inSuccess[0][0].data);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    })
    .catch(function(inError){
        inRes.status(500).json(inError);
    });
});

router.delete('/admin/award', function(inReq, inRes){
    db.query("match (c:Contest {id:{id}})-[a:award]->(s:Story {id:{idStory}}) delete a return s", {
        id:inReq.body.id,
        idStory:inReq.body.idStory
    })
    .then(function(inSuccess){
        inRes.status(200).json(inSuccess[0][0].data);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    })
    .catch(function(inError){
        inRes.status(500).json(inError);
    });
});

module.exports = router;