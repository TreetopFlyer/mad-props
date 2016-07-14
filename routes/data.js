var router = require('express').Router();
var db = require('../db/neo4j');

router.use('/data', function(inReq, inRes, inNext){
    if(!inReq.Auth.LoggedIn){
        inRes.status(500).json({exception:'you are not authorized to do this'});
        return;
    }else{
        inNext();
    }
});

function getEverything(inOpen){

    return new Promise(function(inResolve, inReject){

        var i, j, k;
        var model = [];
        var contest;
        var story;
        var users;
        var user;

        db.query("match (u:User) return u")
        .then(function(inSuccess){

            users = [];
            for(i=0; i<inSuccess.length; i++){
                user = inSuccess[i][0].data;
                users.push({
                    name:user.name,
                    title:user.title,
                    id:user.id
                });
            }

            return db
            .query("match (c:Contest {open:{status}}) optional match (c)<-[:enter]-(s:Story) optional match (author:User)-[:wrote]->(s)-[:recognize]->(about:User) optional match (voter:User)-[v:vote]->(s) optional match (c)-[a:award]->(s) with c, count(a) as awards, author, s, about, collect(voter) as tally return c, collect(author), collect(s), collect(about), collect(tally), collect(awards)", {status:inOpen});
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
                        author:inSuccess[i][1][j].data.id,
                        story:inSuccess[i][2][j].data,
                        about:inSuccess[i][3][j].data.id,
                        votes:tally,
                        awards:inSuccess[i][5][j]
                    });
                }
                model.push(contest);
            }

            inResolve({contests:model, users:users});
        }, function(inFailure){
            inReject(inFailure);
        });
    });
}

router.get('/data/contests/:status', function(inReq, inRes){

    var mode;
    switch(inReq.params.status){
        case 'open' :
            mode = true;
            break;

        case 'closed' :
            mode = false;
            break;

        default:
            mode = true;
    }

    getEverything(mode)
    .then(function(inSuccess){
        inSuccess.id = inReq.Auth.ID;
        inRes.status(200).send(JSON.stringify(inSuccess, null, '\t'));        
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    });
});

module.exports = router;