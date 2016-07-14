var router = require('express').Router();

var db = require('../db/neo4j');
var User = require('../db/user');
var Contest = require('../db/contest');
var uuid = require('uuid');

router.use('/admin', function(inReq, inRes, inNext){
    if(!inReq.Auth.LoggedIn){
        inRes.status(500).json({exception:'you are not authorized to do this'});
        return;
    }

    User
    .locate({id:inReq.Auth.ID})
    .then(function(inSuccess){
        if(inSuccess.rank == "admin"){
            inNext();
        }else{
            inRes.status(500).json({exception:'you are not admin rank'});
        }
    }, function(inFailure){
        inRes.status(500).json({exception:'you are not authorized to do this'});
    });
});

router.get('/admin/user', function(inReq, inRes){
    db.query("match (u:User) return u")
    .then(function(inSuccess){
        var model = [];
        var user;
        var i;
        for(i=0; i<inSuccess.length; i++){
            user = inSuccess[i][0].data
            model.push(user);
        }
        inRes.status(200).json(model);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
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
    });
});

router.get('/admin/contest', function(inReq, inRes){
    db.query("match (c:Contest) return c")
    .then(function(inSuccess){

        var model = [];
        var contest;
        var i;
        for(i=0; i<inSuccess.length; i++){
            contest = inSuccess[i][0].data
            model.push(contest);
        }
        inRes.status(200).json(model);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
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
    });
});

router.post('/admin/award', function(inReq, inRes){
    db.query("match (s:Story {id:{id}}) optional match (c:Contest)<-[:enter]-(s) with c, s merge (c)-[:award]->(s) return s", {
        id:inReq.body.id
    })
    .then(function(inSuccess){
        inRes.status(200).json(inSuccess[0][0].data);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    });
});
router.delete('/admin/award', function(inReq, inRes){
    db.query("match (s:Story {id:{id}}) optional match (c:Contest)<-[:enter]-(s) with c, s optional match (c)-[a:award]->(s) delete a return s", {
        id:inReq.body.id
    })
    .then(function(inSuccess){
        inRes.status(200).json(inSuccess[0][0].data);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    });
});

module.exports = router;