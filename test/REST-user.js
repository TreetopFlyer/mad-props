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

    /*
    describe("Setup users", function(){


        it("should create a user on POST to admin/user and return the user", function(done){
            chai.request(server)
            .post('/admin/user')
            .set("authorization", testAuthorization)
            .send(testProfile)
            .end(function(inError, inResponse){
                
                should.not.exist(inError);
                should.exist(inResponse.body);

                inResponse.body.should.have.property("id");
                idUser = inResponse.body.id;

                inResponse.body.should.have.property("name");
                inResponse.body.name.should.equal(testProfile.name);

                inResponse.body.should.have.property("rank");
                inResponse.body.rank.should.equal(testProfile.rank);

                inResponse.body.should.have.property("title");
                inResponse.body.title.should.equal(testProfile.title);

                done();
            });
        });
        it("should modify a user on PUT to admin/user and return the user", function(done){
            chai.request(server)
            .put('/admin/user')
            .set("authorization", testAuthorization)
            .send({
                id:idUser,
                name:"modified user name"
            })
            .end(function(inError, inResponse){
                
                should.not.exist(inError);
                should.exist(inResponse.body);

                inResponse.body.should.have.property("id");
                inResponse.body.id.should.equal(idUser);

                inResponse.body.should.have.property("name");
                inResponse.body.name.should.equal("modified user name");

                inResponse.body.should.have.property("rank");
                inResponse.body.rank.should.equal(testProfile.rank);

                inResponse.body.should.have.property("title");
                inResponse.body.title.should.equal(testProfile.title);

                done();
            });
        });
        it("should delete a user on DELETE to admin/user and return the user", function(done){
            chai.request(server)
            .delete('/admin/user')
            .set("authorization", testAuthorization)
            .send({
                id:idUser,
                name:"modified user name"
            })
            .end(function(inError, inResponse){
                
                should.not.exist(inError);
                should.exist(inResponse.body);

                inResponse.body.should.have.property("id");
                inResponse.body.id.should.equal(idUser);

                done();
            });
        });
    });

    describe("Setup contests", function(){
        it("should create a contest on POST to admin/contest and return the contest", function(done){
            chai.request(server)
            .post('/admin/contest')
            .set("authorization", testAuthorization)
            .send(testContest)
            .end(function(inError, inResponse){
                
                should.not.exist(inError);
                should.exist(inResponse.body);

                inResponse.body.should.have.property("id");
                idContest = inResponse.body.id;

                inResponse.body.should.have.property("name");
                inResponse.body.name.should.equal(testContest.name);

                inResponse.body.should.have.property("open");
                inResponse.body.open.should.equal(testContest.open);

                done();
            });
        });
        it("should modify a contest on PUT to admin/contest and return the contest", function(done){
            chai.request(server)
            .put('/admin/contest')
            .set("authorization", testAuthorization)
            .send({
                id:idContest,
                name:"modified contest",
                open:false
            })
            .end(function(inError, inResponse){
                
                should.not.exist(inError);
                should.exist(inResponse.body);

                inResponse.body.should.have.property("id");
                inResponse.body.id.should.equal(idContest);

                inResponse.body.should.have.property("name");
                inResponse.body.name.should.equal("modified contest");

                inResponse.body.should.have.property("open");
                inResponse.body.open.should.equal(false);

                done();
            });
        });

        it("should delete a contest on DELETE to admin/contest and return the contest", function(done){
            chai.request(server)
            .delete('/admin/contest')
            .set("authorization", testAuthorization)
            .send({
                id:idContest
            })
            .end(function(inError, inResponse){
                
                should.not.exist(inError);
                should.exist(inResponse.body);

                inResponse.body.should.have.property("id");
                inResponse.body.id.should.equal(idContest);

                done();
            });
        });
    });
    */

});
