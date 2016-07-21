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

describe("Authentication", function(){

    var express;
    var authorization;
    before(function(done){
        express = server.listen(80);
        done();
    });
    after(function(done){
        express.close();
        done();
    });

    it("checking auth/login with GET and empty authorization header should confirm a logged out status", function(done){
        chai.request(express)
        .get('/auth')
        .set('authorization', "")
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

    it("forging a profile with /auth/impersonate should return a set of credentials", function(done){
        chai.request(express)
        .get('/auth/impersonate/some-admin-id')
        .send()
        .then(function(inSuccess){
            should.exist(inSuccess);
            inSuccess.body.should.have.property('authorization');
            authorization = inSuccess.body.authorization;
            done();
        }, function(inFailure){
            should.not.exist(inFailure);
        }).catch(function(inError){
            done(inError);
        });
    });

    it("checking auth/login with GET but with the new authorization header should confirm a logged in status", function(done){
        chai.request(express)
        .get('/auth')
        .set('authorization', authorization)
        .send()
        .then(function(inSuccess){
            should.exist(inSuccess);
            inSuccess.body.should.have.property('message');
            inSuccess.body.message.should.equal("credentials are good");
            done();
        }, function(inFailure){
            should.not.exist(inFailure);
        }).catch(function(inError){
            done(inError);
        });
    });

})

describe("Graph Scenario", function(){

    var express;
    before(function(done){
        console.log("----------------------------------");
        express = server.listen(80);
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