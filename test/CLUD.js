require('dotenv').config();
var uuid = require('uuid');
var chai = require('chai');
var Contest = require('../db/contest');
var Story = require('../db/story');
var User = require('../db/user');
var db = require('../db/neo4j');

var should = chai.should();

process.env.DB_USERNAME = "neo4j";
process.env.DB_PASSWORD = "admin";
process.env.DB_URL = "http://localhost:7474/db/data/cypher";

//////////////////////

//users
var testAdmin = {
    id:uuid.v1(),
    name:"Test Admin",
    title:"Administrator",
    rank:"admin"
};
var testUserA = {
    id:uuid.v1(),
    name:"Test User A",
    title:"test user",
    rank:"user"
};
var testUserAModified = {
    name:"modified test user",
};
var testUserB = {
    id:uuid.v1(),
    name:"Test User B",
    title:"test user",
    rank:"user"
};

//contest
var testContest = {
    id:uuid.v1(),
    name:"employee of the month - july",
    open:true
};
var testContestModified = {
    name:"modified contest"
};

//story
var testStory = {
    id:uuid.v1(),
    idAuthor:testUserA.id,
    idAbout:testUserB.id,
    idContest:testContest.id,
    story:"what a swell guy"
};
var testStoryModified = {
    story:"modified story"
};

function checkObject(inObject, inTestObject){
    should.exist(inObject);
    for(prop in inTestObject){
        inObject.should.have.property(prop);
        inObject[prop].should.equal(inTestObject[prop]);
    }
};

describe("CLUD operations", function(){

    before(function(done){
        console.log("----------------------------------");
        db.purge()
        .then(function(inSuccess){
            done();
        }, function(inFailure){
            done(inFailure);
        });
    });
    after(function(done){
        done();
    });

    describe("User", function(){

        describe("Create", function(){
            it("should create a user on create", function(done){
                User
                .create(testUserA)
                .then(function(inSuccess){
                    checkObject(inSuccess, testUserA);
                    done();
                }, function(inFailure){
                    should.not.exist(inFailure);
                    done();
                });
            });
        });

        describe("Locate", function(){
            it("should locate the created user given its id", function(done){
                User
                .locate({id:testUserA.id})
                .then(function(inSuccess){
                    checkObject(inSuccess, testUserA);
                    done();
                }, function(inFailure){
                    should.not.exist(inFailure);
                    done();
                });
            });
            it("should fail to locate a user given a bogus id", function(done){
                User
                .locate({id:"gibberish"})
                .then(function(inSuccess){
                    should.not.exist(inSuccess);
                    done();
                }, function(inFailure){
                    should.exist(inFailure);
                    done();
                });
            });
        });

        describe("Update", function(){
            it("should update a user", function(done){
                User
                .update({id:testUserA.id, fields:testUserAModified})
                .then(function(inSuccess){
                    checkObject(inSuccess, testUserAModified);
                    done();
                }, function(inFailure){
                    should.not.exist(inFailure);
                    done();
                });
            });
            it("should fail to update a user given a bogus id", function(done){
                User
                .update({id:"gibberish", fields:testUserAModified})
                .then(function(inSuccess){
                    should.not.exist(inSuccess);
                    done();
                }, function(inFailure){
                    should.exist(inFailure);
                    done();
                });
            });
        });

        describe("Delete", function(){
            it("should delete a user", function(done){
                User
                .delete({id:testUserA.id})
                .then(function(inSuccess){
                    checkObject(inSuccess, {id:testUserA.id})
                    done();
                }, function(inFailure){
                    should.not.exist(inFailure);
                    done();
                });
            });
            it("should fail to delete a user given a bogus id", function(done){
                User
                .delete({id:"gibberish"})
                .then(function(inSuccess){
                    should.not.exist(inSuccess);
                    done();
                }, function(inFailure){
                    should.exist(inFailure);
                    done();
                });
            });
        });

    });

    describe("Contest", function(){
        describe("Create", function(){
            it("should create a contest", function(done){
                Contest
                .create(testContest)
                .then(function(inSuccess){
                    checkObject(inSuccess, testContest);
                    done();
                }, function(inFailure){
                    should.not.exist(inFailure);
                    done();
                });
            });
        });
        describe("Locate", function(){
            it("should locate the created contest given its id", function(done){
                Contest
                .locate({id:testContest.id})
                .then(function(inSuccess){
                    checkObject(inSuccess, testContest);
                    done();
                }, function(inFailure){
                    should.not.exist(inFailure);
                    done();
                });
            });
            it("should fail to locate a contest given a bogus id", function(done){
                Contest
                .locate({id:"gibberish"})
                .then(function(inSuccess){
                    should.not.exist(inSuccess);
                    done();
                }, function(inFailure){
                    should.exist(inFailure);
                    done();
                });
            });
        });
        describe("Update", function(){
            it("should update a contest", function(done){
                Contest
                .update({id:testContest.id, fields:testContestModified})
                .then(function(inSuccess){
                    checkObject(inSuccess, testContestModified);
                    done();
                }, function(inFailure){
                    should.not.exist(inFailure);
                    done();
                });
            });
            it("should fail to update a contest given a bogus id", function(done){
                Contest
                .update({id:"gibberish", fields:testContestModified})
                .then(function(inSuccess){
                    should.not.exist(inSuccess);
                    done();
                }, function(inFailure){
                    should.exist(inFailure);
                    done();
                });
            });
        });
        describe("Delete", function(){
            it("should delete a contest given an id", function(done){
                Contest
                .delete({id:testContest.id})
                .then(function(inSuccess){
                    checkObject(inSuccess, {id:testContest.id});
                    done();
                }, function(inFailure){
                    should.not.exist(inFailure);
                    done();
                });
            });
            it("should fail to delete a contest given a bogus id", function(done){
                Contest
                .delete({id:"gibberish"})
                .then(function(inSuccess){
                    should.not.exist(inSuccess);
                    done();
                }, function(inFailure){
                    should.exist(inFailure);
                    done();
                });
            });
        });

    });

    describe("Story", function(){

        before(function(done){
            User.create(testUserA)
            .then(function(){ return User.create(testUserB); })
            .then(function(){ return Contest.create(testContest); })
            .then(function(){ done(); });
        });
        after(function(done){
            done();
        })

        describe("Create", function(){
            it("should create a story", function(done){
                Story
                .create(testStory)
                .then(function(inSuccess){
                    checkObject(inSuccess, {id:testStory.id, story:testStory.story});
                    done();
                }, function(inFailure){
                    should.not.exist(inFailure);
                    done();
                });
            });
            it("should fail to create a story with bad or missing ids", function(done){
                Story
                .create({idAuthor:"gibberish"})
                .then(function(inSuccess){
                    should.not.exist(inSuccess);
                    done();
                }, function(inFailure){
                    should.exist(inFailure);
                    done();
                });
            });
        });
        describe("Locate", function(){
            it("should locate the created story given its id", function(done){
                Story
                .locate({id:testStory.id})
                .then(function(inSuccess){
                    checkObject(inSuccess);
                    done();
                }, function(inFailure){
                    should.not.exist(inFailure);
                    done();
                });
            });
            it("should fail to locate a story given a bogus id", function(done){
                Story
                .locate({id:"gibberish"})
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
        });
        describe("Update", function(){
            it("should update a story", function(done){
                Story
                .update({id:testStory.id, fields:testStoryModified})
                .then(function(inSuccess){
                    checkObject(inSuccess, testStoryModified);
                    done();
                }, function(inFailure){
                    should.not.exist(inFailure);
                    done();
                }).catch(function(inError){
                    done(inError);
                });
            });
            it("should fail to update a story given a bogus id", function(done){
                Story
                .update({id:"gibberish", fields:testStoryModified})
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
        });
        describe("Delete", function(){
            it("should delete a story given an id", function(done){
                Story
                .delete({id:testStory.id})
                .then(function(inSuccess){
                    checkObject(inSuccess, {id:testStory.id});
                    done();
                }, function(inFailure){
                    should.not.exist(inFailure);
                    done();
                }).catch(function(inError){
                    done(inError);
                });
            });
            it("should fail to delete a story given a bogus id", function(done){
                Story
                .delete({id:"gibberish"})
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
        });
    });

});