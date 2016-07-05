require('dotenv').config();
process.env.DB_USERNAME = "neo4j";
process.env.DB_PASSWORD = "admin";
process.env.DB_URL = "http://localhost:7474/db/data/cypher";

var chai = require('chai');
var chaiHTTP = require('chai-http');
var server = require('../server');
var database = require('../db/neo4j');
var Auth = require('../classes/Auth');
var User = require('../db/user');

var should = chai.should();
chai.use(chaiHTTP);



////////////////////
var testAdmin = {name:"admin tester", identity:"1234", title:"test admin-level user", rank:"admin"};
var testUser = {name:"tester", identity:"5678", title:"test user", rank:"user"};
var forge = Auth.Forge(testAdmin.identity);

describe("Admin REST API", function(){

    before(function(done){
        database.purge()
        .then(function(inSuccess){
            return User.create(testAdmin);
        }, function(inFailure){
            throw inFailure;
        })
        .then(function(inSuccess){
            done();
        }, function(inFailure){
            throw inFailure;
        });
    });


    it("should be able to add a test user", function(done){
        chai
        .request(server)
        .post('/admin/user')
        .set('authorization', Auth.Forge(testAdmin.identity))
        .send(testUser)
        .end(function(inError, inResponse){
            inResponse.body.should.be.an('object');

            inResponse.body.should.have.property('name');
            inResponse.body.name.should.equal(testUser.name);

            inResponse.body.should.have.property('title');
            inResponse.body.title.should.equal(testUser.title);

            inResponse.body.should.have.property('rank');
            inResponse.body.rank.should.equal(testUser.rank);

            inResponse.body.should.have.property('identity');
            inResponse.body.identity.should.equal(testUser.identity);

            done();
        })
    });

    it("should be able to create a contest", function(done){
    });




});
