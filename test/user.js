require('dotenv').config();

var chai = require('chai');
var chaiHTTP = require('chai-http');
var User = require('../db/user');


var should = chai.should();
chai.use(chaiHTTP);

process.env.DB_USERNAME = "neo4j";
process.env.DB_PASSWORD = "admin";
process.env.DB_URL = "http://localhost:7474/db/data/cypher";



describe("User CRUD", function(){

    it("should fail to find a user that doesn't exist", function(done){
        User
        .find({identity:"1234"})
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

    it("should create a user on create", function(done){
        User
        .create({identity:"1234", name:"Admin", title:"test user", rank:"admin"})
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

    it("should succeed when trying to find the new user", function(done){
        User
        .find({identity:"1234"})
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

    it("should update a user on update", function(done){
        User
        .update({identity:"1234", fields:{title:"test user updated"}})
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

    it("the updated user should have updated fields", function(done){
        User
        .find({identity:"1234"})
        .then(function(inSuccess){
            should.exist(inSuccess);
            inSuccess.title.should.equal("test user updated");
            done();
        }, function(inFailure){
            should.not.exist(inFailure);
            done();
        }).catch(function(inError){
            done(inError);
        });
    });

    it("should delete a user on delete", function(done){
        User
        .delete({identity:"1234"})
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

    it("should fail to delete a user that doesn't exist", function(done){
        User
        .find({identity:"123456789"})
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