require('dotenv').config();

var chai = require('chai');
var Contest = require('../db/contest');
var Story = require('../db/story');
var User = require('../db/user');
var db = require('../db/neo4j');
var uuid = require('uuid');

var should = chai.should();

process.env.DB_USERNAME = "neo4j";
process.env.DB_PASSWORD = "admin";
process.env.DB_URL = "http://localhost:7474/db/data/cypher";

//////////////////////

//contest
var testContest = {
    id:uuid.v1(),
    name:"employee of the month - july",
    open:true
};

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
var testUserB = {
    id:uuid.v1(),
    name:"Test User B",
    title:"test user",
    rank:"user"
};

//story
var testStory = {
    id:uuid.v1(),
    idAuthor:testUserA.id,
    idAbout:testUserB.id,
    idContest:testContest.id,
    story:"what a swell guy"
};

function checkObject(inObject, inTestObject){
    should.exist(inObject);
    for(prop in inTestObject){
        inObject.should.have.property(prop);
        inObject[prop].should.equal(inTestObject[prop]);
    }
};

describe("CRUD operations", function(){

    before(function(done){
        db
        .purge()
        .then(function(inSuccess){
            done();
        }, function(inFailure){
            done(inFailure);
        })
    });
    after(function(done){

    });

});