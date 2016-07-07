require('dotenv').config();

var chai = require('chai');
var chaiHTTP = require('chai-http');
var server = require('../server.js');
var db = require('../db/neo4j');
var User = require('../db/user');
var Story = require('../db/story');
var Auth = require('../classes/Auth');

var uuid = require('uuid');

var should = chai.should();
chai.use(chaiHTTP);

process.env.DB_USERNAME = "neo4j";
process.env.DB_PASSWORD = "admin";
process.env.DB_URL = "http://localhost:7474/db/data/cypher";


var testProfileUser = {
    name:"test user",
    rank:"user",
    title:"tester"
};
var testProfileAdmin = {
    id:"1",
    name:"Administrator",
    title:"Administrator",
    rank:"admin"
};
var testAuthorization = Auth.Forge(testProfileAdmin.id);

var testContest = {
    name:"employee of the month",
    open:true
};

var idUser;
var idContest;
var idStory = uuid.v1()
var express;

describe("Admin REST", function(){

    before(function(done){
        express = server.listen(80);

        db.purge()
        .then(function(inSuccess){
            return User.create(testProfileAdmin);
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

    describe("Setup users", function(){

        it("should create a user on POST to admin/user and return the user", function(done){
            chai.request(server)
            .post('/admin/user')
            .set("authorization", testAuthorization)
            .send(testProfileUser)
            .end(function(inError, inResponse){
                
                should.not.exist(inError);
                should.exist(inResponse.body);

                inResponse.body.should.have.property("id");
                idUser = inResponse.body.id;

                inResponse.body.should.have.property("name");
                inResponse.body.name.should.equal(testProfileUser.name);

                inResponse.body.should.have.property("rank");
                inResponse.body.rank.should.equal(testProfileUser.rank);

                inResponse.body.should.have.property("title");
                inResponse.body.title.should.equal(testProfileUser.title);

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
                inResponse.body.rank.should.equal(testProfileUser.rank);

                inResponse.body.should.have.property("title");
                inResponse.body.title.should.equal(testProfileUser.title);

                done();
            });
        });
        it("should delete a user on DELETE to admin/user and return the user", function(done){
            chai.request(server)
            .delete('/admin/user')
            .set("authorization", testAuthorization)
            .send({
                id:idUser
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
        
        it("should award a story on POST to admin/contest/award and return the story", function(done){

            chai.request(server)
            .post('/admin/user')
            .set('authorization', testAuthorization)
            .send(testProfileUser)
            .then(function(inSuccess){
                return Story.create({
                    id:idStory,
                    story:"what a swell guy",
                    idAuthor:inSuccess.body.id,
                    idAbout:"1",
                    idContest:idContest
                });
            })
            .then(function(inSuccess){
                return chai.request(server)
                .post('/admin/contest/award')
                .set('authorization', testAuthorization)
                .send({
                    id:idContest,
                    idStory:idStory
                });
            })
            .then(function(inSuccess){
                should.exist(inSuccess.body);

                inSuccess.body.should.have.property("id");
                inSuccess.body.id.should.equal(idStory);

                done();
            }, function(inFailure){
                should.not.exist(inFailure);
                done();
            })
            .catch(function(inError){
                done(inError);
            })
        });

        it("should revoke and awarded a story on DELETE to admin/contest/award and return the story", function(done){
            chai.request(server)
            .delete('/admin/contest/award')
            .set('authorization', testAuthorization)
            .send({
                id:idContest,
                idStory:idStory
            })
            .end(function(inError, inResponse){
                
                should.not.exist(inError);
                should.exist(inResponse.body);

                inResponse.body.should.have.property("id");
                inResponse.body.id.should.equal(idStory);

                done();
            });
        });

        it("should modify a contest on PUT to admin/contest and return the contest", function(done){
            chai.request(server)
            .put('/admin/contest')
            .set('authorization', testAuthorization)
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

});