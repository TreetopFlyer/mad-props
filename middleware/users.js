var router = require('express').Router();
var neo4j = require('../db/neo4j');

router.get('/user/all', function(inReq, inRes){
    neo4j
    .query("MATCH (u:User) return u", {})
    .then(function(inData){
        var out = [];
        var i;
        for(i=0; i<inData.length; i++){
            out.push({data:inData[i][0].data, meta:inData[i][0].metadata});
        }
        inRes.render("users", {users:out});
    }, function(inFailure){
        inRes.send(inFailure);
    });
});

router.post('/user', function(inReq, inRes){
    neo4j
    .query("MATCH (u:User {email:{userEmail}}) return u", {userEmail:inReq.body.userEmail})
    .then(function(inData){
        if(inData.length == 0){
            console.log("user NOT found. creating a new one.");
            return neo4j.query("CREATE (u:User {name:{userName}, title:{userTitle}, email:{userEmail}}) return u", {
                userName : inReq.body.userName,
                userTitle : inReq.body.userTitle,
                userEmail : inReq.body.userEmail
            });
        }else{
            console.log("user FOUND. rendering the match.", inData);
            return Promise.resolve(inData);
        }
    }, function(inError){
        return Promise.reject(inError);
    })
    .then(function(inData){
        inRes.send(inData[0][0].data);
    }, function(inError){
        inRes.send(inError);
    });
});

router.post('/story', function(inReq, inRes){
    neo4j.query("match (userFrom:User {email:{emailFrom}}), (userTo:User {email:{emailTo}}) create (s:Story {story:{storyCopy}}), userFrom-[:wrote]->s-[:recognizes]->userTo", {
        storyCopy : inReq.body.storyCopy,
        emailFrom : inReq.body.emailFrom,
        emailTo : inReq.body.emailTo
    })
    .then(function(inData){
        inRes.send(inData);
    }, function(inError){
        inRes.send(inError);
    });
});

router.post('/vote', function(inReq, inRes){
    neo4j.query("match (u:User {email:{emailFrom}}), (s:Story) where id(s) = toInt({storyID}) create (u)-[v:vote]->(s) return u", {
        emailFrom : inReq.body.emailFrom,
        storyID : inReq.body.storyID
    })
    .then(function(inData){
        console.log("voted", inData);
        inRes.send(inData);
    }, function(inError){
        console.log("problem voting");
        inRes.send(inError);
    })
});

module.exports = router;