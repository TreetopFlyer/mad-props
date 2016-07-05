require('dotenv').config();

var chai = require('chai');
var chaiHTTP = require('chai-http');
var Contest = require('../db/contest');


var should = chai.should();
chai.use(chaiHTTP);

process.env.DB_USERNAME = "neo4j";
process.env.DB_PASSWORD = "admin";
process.env.DB_URL = "http://localhost:7474/db/data/cypher";

var testId;
var testName = "summer employee of the month"
var testStatus = false;

describe("Contest CRUD", function(){

    it("should create a contest on create", function(done){
        Contest
        .create({name:testName, open:testStatus})
        .then(function(inSuccess){

            should.exist(inSuccess);
            
            inSuccess.should.have.property('id');
            testId = inSuccess.id;

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

    it("should fail to find a contest that doesn't exist", function(done){
        Contest
        .find({id:"gibberish"})
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

    it("should find a contest with id of the contest that was created", function(done){
        Contest
        .find({id:testId})
        .then(function(inSuccess){
            should.exist(inSuccess);
            inSuccess.should.have.property('id');
            inSuccess.id.should.equal(testId);
            inSuccess.should.have.property('name');
            inSuccess.name.should.equal(testName);
            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("should update a contest on update", function(done){
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

    it("should delete a contest on delete", function(done){
        Contest
        .delete({id:testId})
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


    it("should fail to delete a contest that doesnt exist", function(done){
        Contest
        .delete({id:123456789})
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