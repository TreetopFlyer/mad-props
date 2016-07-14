var router = require('express').Router();
var db = require('../db/neo4j');
var User = require('../db/user');
var Contest = require('../db/contest');
var Story = require('../db/story');
var uuid = require('uuid');

router.use('/user', function(inReq, inRes, inNext){
    if(!inReq.Auth.LoggedIn){
        inRes.status(500).json({exception:'you are not authorized to do this'});
        return;
    }else{
        inNext();
    }
});

router.post('/user/story', function(inReq, inRes){
    Story.create({
        id:uuid.v1(),
        idAuthor:inReq.Auth.ID,
        idAbout:inReq.body.idAbout,
        idContest:inReq.body.idContest,
        story:inReq.body.story
    })
    .then(function(inSuccess){
        inRes.status(200).json(inSuccess);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    });
});
router.put('/user/story', function(inReq, inRes){
    Story.update({
        id:inReq.body.id,
        fields:{
            story:inReq.body.story
        }
    })
    .then(function(inSuccess){
        inRes.status(200).json(inSuccess);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    });
});
router.delete('/user/story', function(inReq, inRes){
    Story.delete({
        id:inReq.body.id
    })
    .then(function(inSuccess){
        inRes.status(200).json(inSuccess);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    });
});

router.post('/user/vote', function(inReq, inRes){
    db.query("match (u:User {id:{id}}) optional match (s:Story {id:{idStory}})-[:enter]->(c:Contest {open:true}) create (u)-[:vote]->(s) return s", {
        id:inReq.Auth.ID,
        idStory:inReq.body.id
    })
    .then(function(inSuccess){
        if(inSuccess[0][0]){
            inRes.status(200).json(inSuccess[0][0].data);
        }else{
            return Promise.reject(inSuccess);
        } 
    }).catch(function(inError){
        inRes.status(500).json({exception:"either story doesnt exist or the contest is invalid,"});
    })
});

router.delete('/user/vote', function(inReq, inRes){
    db.query("match (u:User {id:{id}})-[v:vote]->(s:Story {id:{idStory}}) with v, s limit 1 delete v return s", {
        id:inReq.Auth.ID,
        idStory:inReq.body.id
    })
    .then(function(inSuccess){
        inRes.status(200).json(inSuccess[0][0].data);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    });
});

module.exports = router;