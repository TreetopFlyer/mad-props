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

process.env.DB_USERNAME = "neo4j";
process.env.DB_PASSWORD = "admin";
process.env.DB_URL = "http://localhost:7474/db/data/cypher";

//////////////////////

// users
var testProfileAdmin = {
    id:uuid.v1(),
    name:"Administrator",
    title:"Administrator",
    rank:"admin"
};
var testProfileUserA = {
    name:"Test User A",
    title:"test user",
    rank:"user"
};
var testProfileUserAModified = {
    name:"modified test user",
};
var testProfileUserB = {
    name:"Test User B",
    title:"test user",
    rank:"user"
};

var testAuthorization = Auth.Forge(testProfileAdmin.id);
var testProfileUserAID = "";
var testProfileUserBID = "";


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

describe("REST", function(){

    var express;
    before(function(done){
        console.log("----------------------------------");
        express = server.listen(80);
        db.purge()
        .then(function(inSuccess){ return User.create(testProfileAdmin); })
        .then(function(inSuccess){ done(); });
    });
    after(function(done){
        express.close();
        done();
    });

    /*
    describe("User", function(){

        describe("Story setup (/user/story)", function(){
            describe("POST", function(){
                it("should create a story on POST", function(done){

                    chai.request(server)
                    .post('/user/story')
                    .set('authorization', testAuthorization)
                    .send({

                    })
                });
            })
        });

    });
    */

    describe("Administrator", function(){

        describe("User setup (/admin/user)", function(){
            describe("POST", function(){
                it("should create a user and return the user", function(done){
                    chai.request(server)
                    .post('/admin/user')
                    .set("authorization", testAuthorization)
                    .send(testProfileUserA)
                    .then(function(inSuccess){
                        inSuccess.body.should.have.property("id");
                        testProfileUserAID = inSuccess.body.id;
                        checkObject(inSuccess.body, testProfileUserA);
                        done();
                    }, function(inFailure){
                        should.not.exist(inFailure);
                        done();
                    });
                });
            });
            describe("PUT", function(){
                it("should modify a user on PUT to admin/user and return the user", function(done){

                    testProfileUserAModified.id = testProfileUserAID;

                    chai.request(server)
                    .put('/admin/user')
                    .set("authorization", testAuthorization)
                    .send(testProfileUserAModified)
                    .then(function(inSuccess){
                        checkObject(inSuccess.body, testProfileUserAModified);
                        done();
                    }, function(inFailure){
                        should.not.exist(inFailure);
                        done();
                    });
                });
            });
            describe("DELETE", function(){
                it("should delete a user on DELETE to admin/user and return the user", function(done){

                    var idObject = {id:testProfileUserAID};

                    chai.request(server)
                    .delete('/admin/user')
                    .set("authorization", testAuthorization)
                    .send(idObject)
                    .then(function(inSuccess){
                        checkObject(inSuccess.body, idObject);
                        done();
                    }, function(inFailure){
                        should.not.exist(inFailure);
                        done();
                    });
                });
            });
        });

        describe("Contest setup (/admin/contest)", function(){
            describe("POST", function(){
                it("should create a contest on POST", function(done){

                    chai.request(server)
                    .post('/admin/contest')
                    .set('authorization', testAuthorization)
                    .send(testContest)
                    .then(function(inSuccess){
                        inSuccess.body.should.have.property("id");
                        testContestID = inSuccess.body.id;
                        checkObject(inSuccess.body, testContest);
                        done();
                    }, function(inFailure){
                        should.not.exist(inFailure);
                        done();
                    });
                });
            });
            describe("PUT", function(){
                it("should update a contest on PUT", function(done){

                    testContestModified.id = testContestID;

                    chai.request(server)
                    .put('/admin/contest')
                    .set('authorization', testAuthorization)
                    .send(testContestModified)
                    .then(function(inSuccess){
                        checkObject(inSuccess.body, testContestModified);
                        done();
                    }, function(inFailure){
                        should.not.exist(inFailure);
                        done();
                    });
                });
            });
            describe("DELETE", function(){
                it("should delete a contest on DELETE", function(done){

                    var idObject = {id:testProfileUserAID};

                    chai.request(server)
                    .delete('/admin/contest')
                    .set('authorization', testAuthorization)
                    .send(idObject)
                    .then(function(inSuccess){
                        checkObject(inSuccess.body, idObject);
                        done();
                    }, function(inFailure){
                        should.not.exist(inFailure);
                        done();
                    });
                });
            });
        });

        /*
        describe("Contest award (/admin/contest/award)", function(){
            describe("POST", function(){
                chai.request(server)
                .post('/admin/contest/award/')
                .set('authorization', testAuthorization)
                .send()
            });
        });
        */

    });

});