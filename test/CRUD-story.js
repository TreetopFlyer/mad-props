require('dotenv').config();

var chai = require('chai');
var Story = require('../db/story');
var Contest = require('../db/contest');
var User = require('../db/user');
var db = require('../db/neo4j');

var uuid = require('uuid');

var should = chai.should();

process.env.DB_USERNAME = "neo4j";
process.env.DB_PASSWORD = "admin";
process.env.DB_URL = "http://localhost:7474/db/data/cypher";

var testId = uuid.v1();
var testStory = "this User is really great";
var testAuthor, testAbout, testContest;
var testAuthorId = "1";
var testAboutId = "2";
var testContestId = "3";

describe("Story CRUD", function(){

    before(function(done){
        db.purge()
        .then(function(inSuccess){
            User.create({id:testAuthorId, name:"author man", title:"author", rank:"pleb"})
        }, function(inFailure){
            return Promise.reject(inFailure);
        })
        .then(function(inSuccess){
            return User.create({id:testAboutId, name:"person man", title:"worker", rank:"pleb"});
        }, function(inFailure){
            return Promise.reject(inFailure);
        })
        .then(function(inSuccess){
            return Contest.create({id:testContestId, name:"employee of the month", open:true});
        }, function(inFailure){
            return Promise.reject(inFailure);
        })
        .then(function(inSuccess){
            done();
        }).catch(function(inError){
            done(inError);
        });
    });


    it("should create a story", function(done){
        Story
        .create({id:testId, story:testStory, idAuthor:testAuthorId, idAbout:testAboutId, idContest:testContestId})
        .then(function(inSuccess){

            should.exist(inSuccess);
            
            inSuccess.should.have.property('id');
            inSuccess.id.should.equal(testId);

            inSuccess.should.have.property('story');
            inSuccess.story.should.equal(testStory);

            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });
    it("should fail to create a story with bad ids", function(done){
        Story
        .create({id:testId, story:testStory, idAuthor:"gibberish", idAbout:"gibberish", idContest:"gibberish"})
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



    it("should locate the created story given its id", function(done){
        Story
        .locate({id:testId})
        .then(function(inSuccess){
            should.exist(inSuccess);

            inSuccess.should.have.property('id');
            inSuccess.id.should.equal(testId);

            inSuccess.should.have.property('story');
            inSuccess.story.should.equal(testStory);

            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
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

    it("should update a story", function(done){
        Story
        .update({id:testId, fields:{story:"actually, he's the best."}})
        .then(function(inSuccess){
            should.exist(inSuccess);

            inSuccess.should.have.property('id');
            inSuccess.id.should.equal(testId);

            inSuccess.should.have.property('story');
            inSuccess.story.should.equal("actually, he's the best.");

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
        .update({id:"gibberish", fields:{story:"actually, he's the best."}})
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
    
    it("should delete a story given an id", function(done){
        Story
        .delete({id:testId})
        .then(function(inSuccess){
            should.exist(inSuccess);

            inSuccess.should.have.property('id');
            inSuccess.id.should.equal(testId);

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