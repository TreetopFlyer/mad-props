var router = require('express').Router();
var neo4j = require('../db/neo4j');

router.get('/stories', function(inReq, inRes){

    var model = [];

    neo4j.query("match (author:User)-[:wrote]->(story:Story)-[:recognizes]->(coworker:User) optional match (voter:User)-[:vote]->(story) return author, story, coworker, collect(voter)", {})
    .then(function(inData){

        var i, j;
        for(i=0; i<inData.length; i++){
            var voters = [];
            for(j=0; j<inData[i][3].length; j++){
                voters.push(inData[i][3][j].data);
            }
            model.push({
                author:inData[i][0].data,
                story:inData[i][1].data,
                recognizes:inData[i][2].data,
                voters:voters
            });
        }

        inRes.send(model);
    }, function(inError){
        inRes.send(inError);
    });
});


module.exports = router;