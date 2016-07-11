var router = require('express').Router();
var db = require('../db/neo4j');

router.get('/contest', function(inReq, inRes){
    db.query("match (c:Contest)<-[:enter]-(s:Story) optional match (author:User)-[:wrote]->(s)-[:recognize]->(about:User) optional match (voter:User)-[v:vote]->(s) with c, author, s, about, count(v) as votes  return c, collect(author), collect(s), collect(about), collect(votes)")
    .then(function(inSuccess){
        var i, j;
        var model = [];
        var contest;
        var story;
        for(i=0; i<inSuccess.length; i++){
            contest = {
                contest:inSuccess[i][0].data,
                stories:[]
            };
            for(j=0; j<inSuccess[i][1].length; j++){
                contest.stories.push({
                    author:inSuccess[i][1][j].data,
                    story:inSuccess[i][2][j].data,
                    about:inSuccess[i][3][j].data,
                    votes:inSuccess[i][4][j],
                });
            }
            model.push(contest);
        }
        inRes.status(200).json(model);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    });
});

module.exports = router;