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

        db.query("match (u:User) return {name:u.name, title:u.title, id:u.id}")
        .then(function(inSuccess){

            users = [];
            for(i=0; i<inSuccess.length; i++){
                users.push(inSuccess[i][0]);
            }

            return db
            .query("match (contest:Contest {open:{status}}) "+
                    "optional match (contest)<-[:enter]-(story:Story) "+
                    "optional match (author:User)-[:wrote]->(story) "+
                    "optional match (about:User)<-[:recognize]-(story) "+
                    "optional match (voter:User)-[:vote]->(story) "+
                    "optional match (contest)-[a:award]->(story) "+
                    "with contest, story, author, about, voter, a IS NOT NULL as award "+
                    "with contest, {id:story.id, story:story.story, author:author.id, about:about.id, votes:collect(voter.id), awards:award} as stories "+
                    "with {name:contest.name, id:contest.id, stories:collect(stories)} as overview "+
                    "return collect(overview)", {status:inOpen});
        })
        .then(function(inSuccess){
            inResolve({contests:inSuccess[0][0], users:users});
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