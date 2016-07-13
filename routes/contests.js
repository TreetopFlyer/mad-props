var router = require('express').Router();
var db = require('../db/neo4j');

router.get('/contests', function(inReq, inRes){

    var i, j, k;
    var model = [];
    var contest;
    var story;
    var users;

    db.query("match (u:User) return u")
    .then(function(inSuccess){

        users = [];
        for(i=0; i<inSuccess.length; i++){
            users.push(inSuccess[i][0].data);
        }

        return db
        .query("match (c:Contest {open:true}) optional match (c)<-[:enter]-(s:Story) optional match (author:User)-[:wrote]->(s)-[:recognize]->(about:User) optional match (voter:User)-[v:vote]->(s) with c, author, s, about, collect(voter) as tally return c, collect(author), collect(s), collect(about), collect(tally)")
    })
    .then(function(inSuccess){
        for(i=0; i<inSuccess.length; i++){
            contest = {
                contest:inSuccess[i][0].data,
                stories:[]
            };
            for(j=0; j<inSuccess[i][1].length; j++){

                var tally = [];
                for(k=0; k<inSuccess[i][4][j].length; k++){
                    tally.push(inSuccess[i][4][j][k].data.id);
                }

                contest.stories.push({
                    author:inSuccess[i][1][j].data,
                    story:inSuccess[i][2][j].data,
                    about:inSuccess[i][3][j].data,
                    votes:tally
                });
            }
            model.push(contest);
        }
        inRes.status(200).json({contests:model, users:users, id:inReq.Auth.ID});
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    });

    
});

module.exports = router;