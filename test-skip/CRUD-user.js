require('dotenv').config();

var chai = require('chai');
var User = require('../db/user');
var uuid = require('uuid');

var should = chai.should();

process.env.DB_USERNAME = "neo4j";
process.env.DB_PASSWORD = "admin";
process.env.DB_URL = "http://localhost:7474/db/data/cypher";

var testId = uuid.v1();
var testName = "person man";
var testTitle = "administrator";
var testRank = "admin";

describe("User CRUD", function(){

    it("should create a user on create", function(done){
        User
        .create({id:testId, name:testName, title:testTitle, rank:testRank})
        .then(function(inSuccess){
            should.exist(inSuccess);

            inSuccess.should.have.property('id');
            inSuccess.id.should.equal(testId);

            inSuccess.should.have.property('name');
            inSuccess.name.should.equal(testName);

            inSuccess.should.have.property('title');
            inSuccess.title.should.equal(testTitle);

            inSuccess.should.have.property('rank');
            inSuccess.rank.should.equal(testRank);

            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("should locate the created user given its id", function(done){
        User
        .locate({id:testId})
        .then(function(inSuccess){
            should.exist(inSuccess);

            inSuccess.should.have.property('id');
            inSuccess.id.should.equal(testId);

            inSuccess.should.have.property('name');
            inSuccess.name.should.equal(testName);

            inSuccess.should.have.property('title');
            inSuccess.title.should.equal(testTitle);

            inSuccess.should.have.property('rank');
            inSuccess.rank.should.equal(testRank);

            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
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
        }).catch(function(inError){
            done(inError);
        });
    });

    it("should update a user", function(done){
        User
        .update({id:testId, fields:{title:"test user updated"}})
        .then(function(inSuccess){
            should.exist(inSuccess);

            inSuccess.should.have.property('id');
            inSuccess.id.should.equal(testId);

            inSuccess.should.have.property('name');
            inSuccess.name.should.equal(testName);

            inSuccess.should.have.property('title');
            inSuccess.title.should.equal("test user updated");

            inSuccess.should.have.property('rank');
            inSuccess.rank.should.equal(testRank);

            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });
    it("should fail to update a user given a bogus id", function(done){
        User
        .update({id:"gibberish", fields:{title:"test user updated"}})
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

    it("should delete a user", function(done){
        User
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
    it("should fail to delete a user given a bogus id", function(done){
        User
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