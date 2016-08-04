require('dotenv').config();

var uuid = require('uuid');
var chai = require('chai');
var chaiHTTP = require('chai-http');
var Contest = require('../db/contest');
var Story = require('../db/story');
var User = require('../db/user');
var db = require('../db/neo4j');
var server = require('../server.js');
var Auth = require('../classes/Auth.js');

var should = chai.should();
chai.use(chaiHTTP);

//////////////////////

// users
var testProfileAdmin = {
    id:uuid.v1(),
    name:"Administrator",
    title:"Administrator",
    email:"admin@admin.admin",
    rank:"admin",
    password:"admin"
};
var testProfileUserA = {
    name:"Test User A",
    title:"test user",
    email:"a@a.a",
    rank:"user"
};
var testProfileUserAModified = {
    name:"modified test user",
};
var testProfileUserB = {
    name:"Test User B",
    title:"test user",
    email:"b@b.b",
    rank:"user"
};

var testAuthorizationAdmin = Auth.Forge(testProfileAdmin.id);
var testAuthorizationUserA;
var testAuthorizationUserB;
var testProfileUserAID;
var testProfileUserBID;


// contest
var testContest = {
    name:"employee of the month",
    open:true
};
var testContestModified = {
    open:false
};
var testContestID = "";


// story
var testStory;
var testStoryId;

function checkObject(inObject, inTestObject){
    should.exist(inObject);
    for(prop in inTestObject){
        inObject.should.have.property(prop);
        inObject[prop].should.equal(inTestObject[prop]);
    }
};



describe("Graph Scenario", function(){

    var express;
    var port;
    before(function(done){
        port = process.env.PORT || 3000;
        console.log("----------------------------------");
        express = server.listen(port);
        db.purge()
        .then(function(inSuccess){ return User.create(testProfileAdmin); })
        .then(function(inSuccess){ done(); })
        .catch(function(inError){
            console.log(inError);
        });
    });
    after(function(done){
        express.close();
        done();
    });

    it("an admin should be able to add two users, A and B", function(done){
        chai.request(server)
        .post('/admin/user')
        .set('authorization', testAuthorizationAdmin)
        .send(testProfileUserA)
        .then(function(inSuccess){

            inSuccess.body.should.have.property('id');
            testProfileUserAID = inSuccess.body.id;
            testAuthorizationUserA = Auth.Forge(testProfileUserAID);

            return chai.request(server)
            .post('/admin/user')
            .set('authorization', testAuthorizationAdmin)
            .send(testProfileUserB)
        })
        .then(function(inSuccess){

            inSuccess.body.should.have.property('id');
            testProfileUserBID = inSuccess.body.id;
            testAuthorizationUserB = Auth.Forge(testProfileUserBID);

            should.exist(inSuccess);
            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("an admin should be able to setup a new contest", function(done){
        chai.request(server)
        .post('/admin/contest')
        .set('authorization', testAuthorizationAdmin)
        .send(testContest)
        .then(function(inSuccess){
            should.exist(inSuccess);

            inSuccess.body.should.have.property('id');
            testContestID = inSuccess.body.id;

            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    
    it("user A should be able to write a story about user B during the contest", function(done){
        chai.request(server)
        .post('/user/story')
        .set('authorization', testAuthorizationUserA)
        .send({
            idAbout:testProfileUserBID,
            idContest:testContestID,
            story:"Gee, what a swell guy."
        })
        .then(function(inSuccess){

            inSuccess.body.should.have.property('id');
            testStoryID = inSuccess.body.id;

            should.exist(inSuccess);
            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("user B should be able to write a story about user A during the contest", function(done){
        chai.request(server)
        .post('/user/story')
        .set('authorization', testAuthorizationUserB)
        .send({
            idAbout:testProfileUserAID,
            idContest:testContestID,
            story:"a cool dude."
        })
        .then(function(inSuccess){

            inSuccess.body.should.have.property('id');
            testStoryID = inSuccess.body.id;

            should.exist(inSuccess);
            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("anyone (including the admin) can vote on the story", function(done){
        chai.request(server)
        .post('/user/vote')
        .set('authorization', testAuthorizationAdmin)
        .send({
            id:testStoryID
        })
        .then(function(inSuccess){
            should.exist(inSuccess);
            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("the admin should be able to award a winning story and also 'close out' the contest", function(done){
        chai.request(server)
        .post('/admin/award')
        .set('authorization', testAuthorizationAdmin)
        .send({
            id:testStoryID
        })
        .then(function(){
            return chai.request(server)
            .put('/admin/contest')
            .set('authorization', testAuthorizationAdmin)
            .send({
                id:testContestID,
                open:false
            });
        })
        .then(function(inSuccess){
            should.exist(inSuccess);
            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("attempts to vote on the story should now fail", function(done){
        chai.request(server)
        .post('/user/vote')
        .set('authorization', testAuthorizationUserA)
        .send({
            id:testStoryID
        })
        .then(function(inSuccess){
            should.not.exist(inSuccess);
            done();
        }, function(inFailure){
            should.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("an admin should be able to setup a new contest again", function(done){
        chai.request(server)
        .post('/admin/contest')
        .set('authorization', testAuthorizationAdmin)
        .send(testContest)
        .then(function(inSuccess){
            should.exist(inSuccess);

            inSuccess.body.should.have.property('id');
            testContestID = inSuccess.body.id;

            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("user A should be able to write a story about user B during the new contest", function(done){
        chai.request(server)
        .post('/user/story')
        .set('authorization', testAuthorizationUserA)
        .send({
            idAbout:testProfileUserBID,
            idContest:testContestID,
            story:"Man, he did it again!"
        })
        .then(function(inSuccess){

            inSuccess.body.should.have.property('id');
            testStoryID = inSuccess.body.id;

            should.exist(inSuccess);
            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("the admin can vote on the story", function(done){
        chai.request(server)
        .post('/user/vote')
        .set('authorization', testAuthorizationAdmin)
        .send({
            id:testStoryID
        })
        .then(function(inSuccess){
            should.exist(inSuccess);
            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("user B can vote on the story", function(done){
        chai.request(server)
        .post('/user/vote')
        .set('authorization', testAuthorizationUserB)
        .send({
            id:testStoryID
        })
        .then(function(inSuccess){
            should.exist(inSuccess);
            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("the admin can retract his vote on the story", function(done){
        chai.request(server)
        .delete('/user/vote')
        .set('authorization', testAuthorizationAdmin)
        .send({
            id:testStoryID
        })
        .then(function(inSuccess){
            should.exist(inSuccess);
            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("the admin should be able to award the new story", function(done){
        chai.request(server)
        .post('/admin/award')
        .set('authorization', testAuthorizationAdmin)
        .send({
            id:testStoryID
        })
        .then(function(inSuccess){
            should.exist(inSuccess);
            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("the admin should be able to retract the award", function(done){
        chai.request(server)
        .delete('/admin/award')
        .set('authorization', testAuthorizationAdmin)
        .send({
            id:testStoryID
        })
        .then(function(inSuccess){
            should.exist(inSuccess);
            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });


});


describe("Authentication and Email", function(){

    var port;
    var express;
    var authorization;
    var profile;

    before(function(done){
        port = process.env.PORT || 3000
        express = server.listen(process.env.PORT || port);
        done();
    });
    after(function(done){
        express.close();
        done();
    });

    it("checking auth/login with GET and a bad/empty authorization header should return a 500", function(done){
        chai.request(server)
        .get('/auth')
        .set('authorization', 'q2r0yq2r0hfai')
        .send()
        .then(function(inSuccess){
            should.not.exist(inSuccess);
            done();
        }, function(inFailure){
            should.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });


    it("posting the Admin's credentials to /auth should return the admin's authorization and profile", function(done){
        chai.request(server)
        .post('/auth')
        .send(testProfileAdmin)
        .then(function(inSuccess){
            should.exist(inSuccess);
            profile = inSuccess.body;
            profile.should.have.property('authorization');
            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        });
    });

    it("checking auth/login with GET and the admin's authorization header should return a 200", function(done){
        chai.request(server)
        .get('/auth')
        .set('authorization', profile.authorization)
        .send()
        .then(function(inSuccess){
            should.exist(inSuccess);
            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("posting an id, subject, and message to user/email with should send an email to a single user", function(done){

        this.timeout(3000);

        chai.request(server)
        .post('/user/email')
        .set('authorization', profile.authorization)
        .send({id:testProfileUserAID, subject:"test subject", message:"mocha testing."})
        .then(function(inSuccess){
            should.exist(inSuccess);
            done();
        }, function(inFailure){
            console.log("failure trace", inFailure.body);
            should.not.exist(inFailure.body);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("posting a bad id to user/email should fail", function(done){

        this.timeout(3000);

        chai.request(server)
        .post('/user/email')
        .set('authorization', profile.authorization)
        .send({id:123412408612471, subject:"test subject", message:"mocha testing."})
        .then(function(inSuccess){
            should.not.exist(inSuccess);
            done();
        }, function(inFailure){
            should.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("posting a subject and message to admin/email with admin credentials should send an email to everyone", function(done){
        
        this.timeout(3000);

        chai.request(server)
        .post('/admin/email')
        .set('authorization', profile.authorization)
        .send({subject:"test subject", message:"mocha testing."})
        .then(function(inSuccess){
            should.exist(inSuccess);
            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("posting a subject and message to admin/email with bad credentials should fail", function(done){
        
        this.timeout(3000);

        chai.request(server)
        .post('/admin/email')
        .set('authorization', "q10497qi2ruhgawf908125")
        .send({subject:"test subject", message:"mocha testing."})
        .then(function(inSuccess){
            should.not.exist(inSuccess);
            done();
        }, function(inFailure){
            should.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

})