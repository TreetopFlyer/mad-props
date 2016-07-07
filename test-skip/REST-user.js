require('dotenv').config();

var chai = require('chai');
var chaiHTTP = require('chai-http');
var server = require('../server.js');
var db = require('../db/neo4j');
var User = require('../db/user');
var Story = require('../db/story');
var Contest = require('../db/contest');
var Auth = require('../classes/Auth.js');

var uuid = require('uuid');

var should = chai.should();
chai.use(chaiHTTP);

process.env.DB_USERNAME = "neo4j";
process.env.DB_PASSWORD = "admin";
process.env.DB_URL = "http://localhost:7474/db/data/cypher";

var testProfileAuthor = {
    id:"tester",
    name:"test author",
    rank:"user",
    title:"author"
};
var testProfileAbout = {
    id:"about",
    name:"test about",
    rank:"user",
    title:"about"
};
var testAuthorization = Auth.Forge(testProfileAuthor.id);
var testContest = {
    id:"contest",
    name:"employee of the month",
    open:true
};
var testStory = "What a swell guy.";
var idStory;

var express;

describe("User REST", function(){

    before(function(done){
        express = server.listen(80);

        db.purge()
        .then(function(inSuccess){
            return User.create(testProfileAuthor);
        })
        .then(function(inSuccess){
            return User.create(testProfileAbout);
        })
        .then(function(inSuccess){
            return Contest.create(testContest);
        })
        .then(function(inSuccess){
            done();
        })
        .catch(function(inError){
            done(inError);
        });
    });

    after(function(done){
        express.close();
        done();
    })

    describe("create a story about another user", function(){

        it("should create a story on POST to user/story and return the story", function(done){
            chai.request(server)
            .post('/user/story')
            .set("authorization", testAuthorization)
            .send({
                idAuthor:testProfileAuthor.id,
                idAbout:testProfileAbout.id,
                idContest:testContest.id,
                story:testStory
            })
            .end(function(inError, inResponse){
                should.not.exist(inError);
                should.exist(inResponse);

                inResponse.body.should.have.property("id");
                idStory = inResponse.body.id;

                inResponse.body.should.have.property("story");
                inResponse.body.story.should.equal(testStory);

                done();
            });
        });

    });

    describe("vote on a story", function(){

        it("should vote a story on POST to user/vote and return the story", function(done){
            chai.request(server)
            .post('/user/vote')
            .set("authorization", testAuthorization)
            .send({
                id:idStory
            })
            .end(function(inError, inResponse){
                should.not.exist(inError);
                should.exist(inResponse);

                inResponse.body.should.have.property("id");
                idStory = inResponse.body.id;

                inResponse.body.should.have.property("story");
                inResponse.body.story.should.equal(testStory);

                done();
            });
        });

        it("should retract a vote on DELETE to user/vote and return the story", function(done){
            chai.request(server)
            .delete('/user/vote')
            .set("authorization", testAuthorization)
            .send({
                id:idStory
            })
            .end(function(inError, inResponse){
                should.not.exist(inError);
                should.exist(inResponse);

                inResponse.body.should.have.property("id");
                idStory = inResponse.body.id;

                inResponse.body.should.have.property("story");
                inResponse.body.story.should.equal(testStory);

                done();
            });
        });

    });

});
