var router = require('express').Router();
var neo4j = require('../db/neo4j');

/* watch out */
router.post('/user', function(inReq, inRes){
    neo4j
    .query("MATCH (u:User {identity:{userIdentity}}) return u", {
        userIdentity:inReq.body.userIdentity
    })
    .then(function(inData){
        if(inData.length == 0){
            return neo4j.query("CREATE (u:User {name:{userName}, title:{userTitle}, identity:{userIdentity}, rank:{userRank}}) return u", {
                userName : inReq.body.userName,
                userTitle : inReq.body.userTitle,
                userIdentity : inReq.body.userIdentity,
                userRank : inReq.body.userRank
            });
        }else{
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
router.get('/user/all', function(inReq, inRes){
    neo4j
    .query("MATCH (u:User) return u", {})
    .then(function(inData){
        var model;
        var i;
        model = {
            users:[]
        };
        for(i=0; i<inData.length; i++){
            model.users.push({data:inData[i][0].data, meta:inData[i][0].metadata});
        }
        inRes.send(model);
    }, function(inFailure){
        inRes.send(inFailure);
    });
});

module.exports = router;