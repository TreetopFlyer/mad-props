require('dotenv').config();

var chai = require('chai');
var Contest = require('../db/contest');
var uuid = require('uuid');

var should = chai.should();

process.env.DB_USERNAME = "neo4j";
process.env.DB_PASSWORD = "admin";
process.env.DB_URL = "http://localhost:7474/db/data/cypher";

var testId = uuid.v1();
var testName = "summer employee of the month"
var testStatus = false;

describe("Contest CRUD", function(){

    it("should create a contest", function(done){
        Contest
        .create({name:testName, open:testStatus, id:testId})
        .then(function(inSuccess){

            should.exist(inSuccess);
            
            inSuccess.should.have.property('id');
            inSuccess.id.should.equal(testId);

            inSuccess.should.have.property('name');
            inSuccess.name.should.equal(testName);

            inSuccess.should.have.property('open');
            inSuccess.open.should.equal(testStatus);

            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("should locate the created contest given its id", function(done){
        Contest
        .locate({id:testId})
        .then(function(inSuccess){
            should.exist(inSuccess);

            inSuccess.should.have.property('id');
            inSuccess.id.should.equal(testId);

            inSuccess.should.have.property('name');
            inSuccess.name.should.equal(testName);

            inSuccess.should.have.property('open');
            inSuccess.open.should.be.a('boolean');

            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
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
        }).catch(function(inError){
            done(inError);
        });
    });

    it("should update a contest", function(done){
        Contest
        .update({id:testId, fields:{name:"modified title", open:true}})
        .then(function(inSuccess){
            should.exist(inSuccess);

            inSuccess.should.have.property('id');
            inSuccess.id.should.equal(testId);

            inSuccess.should.have.property('name');
            inSuccess.name.should.equal("modified title");

            inSuccess.should.have.property('open');
            inSuccess.open.should.equal(true);

            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });
    it("should fail to update a contest given a bogus id", function(done){
        Contest
        .update({id:"gibberish", fields:{name:"modified title", open:true}})
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

    it("should delete a contest given an id", function(done){
        Contest
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
    it("should fail to delete a contest given a bogus id", function(done){
        Contest
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