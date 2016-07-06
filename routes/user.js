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
        inRes.json(inSuccess);
    }, function(inFailure){
        inRes.json(inFailure);
    })
});

router.patch('/user/story', function(inReq, inRes){
    /*
        is the story part of a valid contest?
        have you already voted during this contest?
    */
    db.query("match (u:User {id:{id}}) optional match (s:Story {id:{idStory}}) create (u)-[:vote]->(s) return s", {
        id:inReq.Auth.ID,
        idStory:inReq.body.idStory
    })
    .then(function(inSuccess){
        inRes.json(inSuccess[0][0].data);
    }, function(inFailure){
        inRes.json(inFailure);
    })
});

module.exports = router;