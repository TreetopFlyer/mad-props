var router = require('express').Router();
var neo4j = require('../db/neo4j');

router.use('/me', function(inReq, inRes, inNext){
    if(inReq.Auth.LoggedIn){
        inNext();
    }else{
        inRes.send("you are not authorized to do this");
    }
});

router.get('/me', function(inReq, inRes){
    neo4j.query("match (user:User {identity:{userIdentity}}) return user", {
        userIdentity: inReq.Auth.ID
    })
    .then(function(inData){
        inRes.send(inData[0][0].data);
    }, function(inError){
        inRes.send(inError);
    });
});

router.get('/me/story', function(inReq, inRes){
    neo4j
    .query("MATCH (u:User) where u.identity <> {userIdentity} return u", {
        userIdentity: inReq.Auth.ID
    })
    .then(function(inData){
        var model;
        var i;
        model = {
            users:[]
        };
        for(i=0; i<inData.length; i++){
            model.users.push(inData[i][0].data);
        }
        inRes.render("story", model);
    }, function(inFailure){
        inRes.send(inFailure);
    });
});

router.post('/me/story', function(inReq, inRes){
    neo4j.query("match (userFrom:User {identity:{userIdentity}}), (userTo:User {identity:{otherIdentity}}) create (s:Story {story:{storyCopy}}), userFrom-[:wrote]->s-[:recognizes]->userTo return s", {
        storyCopy : inReq.body.story,
        userIdentity : inReq.Auth.ID,
        otherIdentity : inReq.body.recognize
    })
    .then(function(inData){
        inRes.send(inData);
    }, function(inError){
        inRes.send(inError);
    });
});

router.post('/me/vote', function(inReq, inRes){
    neo4j.query("match (user:User {identity:{userIdentity}}), (author:User)-[:wrote]->(story:Story) where id(story) = toInt({storyID}) and author.identity <> {userIdentity} create (user)-[:vote]->(story) return story", {
        userIdentity : inReq.Auth.ID,
        storyID : inReq.body.storyID
    })
    .then(function(inData){
        console.log(inData);
        inRes.send(inData);
    }, function(inError){
        inRes.send(inError);
    })
});

module.exports = router;