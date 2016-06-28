var router = require('express').Router();
var neo4j = require('../db/neo4j');

router.get('/users', function(inReq, inRes){
    neo4j
    .query("MATCH (u:User) return u", {})
    .then(function(inData){

        var out = [];
        var i;
        for(i=0; i<inData.length; i++){
            console.log(inData[i]);
            out.push({data:inData[i][0].data, meta:inData[i][0].metadata});
        }
        inRes.send(out);
    }, function(inFailure){
        inRes.send(inFailure);
    });
});

module.exports = router;