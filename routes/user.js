var router = require('express').Router();
var db = require('../db/neo4j');
var User = require('../db/user');
var Contest = require('../db/contest');
var Story = require('../db/story');
var uuid = require('uuid');

router.use('/user', function(inReq, inRes, inNext){
    if(!inReq.Auth.LoggedIn){
        inRes.json({exception:'you are not authorized to do this'});
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
    })
});


router.post('/user/vote', function(inReq, inRes){
    db.query("match (u:User {id:{id}}) optional match (s:Story {id:{idStory}})-[:enter]->(c:Contest {open:true}) merge (u)-[:vote]->(s) return s", {
        id:inReq.Auth.ID,
        idStory:inReq.body.id
    })
    .then(function(inSuccess){
        inRes.status(200).json(inSuccess[0][0].data);
    },function(inFailure){
        inRes.status(500).json({exception:"either story doesnt exist or the contest is invalid,"});
    })
    .catch(function(inError){
        inRes.status(500).json(inError);
    })
});

router.delete('/user/vote', function(inReq, inRes){
    db.query("match (u:User {id:{id}})-[v:vote]->(s:Story {id:{idStory}}) delete v return s", {
        id:inReq.Auth.ID,
        idStory:inReq.body.id
    })
    .then(function(inSuccess){
        inRes.status(200).json(inSuccess[0][0].data);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    })
    .catch(function(inError){
        inRes.status(500).json(inError);
    })
});

module.exports = router;