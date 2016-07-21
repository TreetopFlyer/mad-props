var router = require('express').Router();
var db = require('../db/neo4j');
var User = require('../db/user');
var Contest = require('../db/contest');
var Story = require('../db/story');
var uuid = require('uuid');
var nodemailer = require('nodemailer');

router.use('/user', function(inReq, inRes, inNext){
    if(!inReq.Auth.LoggedIn){
        inRes.status(500).json({exception:'you are not authorized to do this'});
        return;
    }else{
        inNext();
    }
});


router.get('/user/profile', function(inReq, inRes){
    User
    .locate({
        id:inReq.Auth.ID
    })
    .then(function(inSuccess){
        inRes.status(200).json(inSuccess);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    });
});
router.put('/user/profile', function(inReq, inRes){
    User
    .update({
        id:inReq.Auth.ID,
        fields:{
            password:inReq.body.password
        }
    })
    .then(function(inSuccess){
        inRes.status(200).json(inSuccess);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    });
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
        inRes.status(200).json(inSuccess);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    });
});
router.put('/user/story', function(inReq, inRes){
    Story.update({
        id:inReq.body.id,
        fields:{
            story:inReq.body.story
        }
    })
    .then(function(inSuccess){
        inRes.status(200).json(inSuccess);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    });
});
router.delete('/user/story', function(inReq, inRes){
    Story.delete({
        id:inReq.body.id
    })
    .then(function(inSuccess){
        inRes.status(200).json(inSuccess);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    });
});



router.post('/user/vote', function(inReq, inRes){
    db.query("match (u:User {id:{id}}) optional match (s:Story {id:{idStory}})-[:enter]->(c:Contest {open:true}) create (u)-[:vote]->(s) return s", {
        id:inReq.Auth.ID,
        idStory:inReq.body.id
    })
    .then(function(inSuccess){
        if(inSuccess[0][0]){
            inRes.status(200).json(inSuccess[0][0].data);
        }else{
            return Promise.reject(inSuccess);
        } 
    }).catch(function(inError){
        inRes.status(500).json({exception:"either story doesnt exist or the contest is invalid,"});
    })
});
router.delete('/user/vote', function(inReq, inRes){
    db.query("match (u:User {id:{id}})-[v:vote]->(s:Story {id:{idStory}}) with v, s limit 1 delete v return s", {
        id:inReq.Auth.ID,
        idStory:inReq.body.id
    })
    .then(function(inSuccess){
        inRes.status(200).json(inSuccess[0][0].data);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    });
});



router.post('/user/email', function(inReq, inRes){
    var profileFrom;
    var profileTo;

    User.locate({id:inReq.Auth.ID})
    .then(function(inSuccess){
        profileFrom = inSuccess;
        return User.locate({id:inReq.body.id});
    })
    .then(function(inSuccess){
        profileTo = inSuccess;
        return new Promise(function(inResolve, inReject){
            var transporter = nodemailer.createTransport(process.env.EMAIL_TRANSPORT_STRING);
            var mailOptions = {
                from: process.env.EMAIL_FROM_STRING,
                to: profileTo.email,
                subject: inReq.body.subject,
                text: inReq.body.message
            };
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    inReject(error);
                }else{
                    inResolve();
                }
            });
        });
    })
    .then(function(inSuccess){
        inRes.sendStatus(200);
    }, function(inFailure){
        inRes.status(500).json(inFailure);
    });

});



module.exports = router;