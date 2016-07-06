var database = require('./neo4j');

var User = {};

User.find = function(inParams){
    return database.query("match (u:User {id:{id}}) return u", inParams)
    .then(function(inSuccess){
            return Promise.resolve(inSuccess[0][0].data);
    }, function(inFailure){
        Promise.reject(inFailure);
    });
};

User.create = function(inParams){
    return database.query("create (u:User {id:{id}, name:{name}, title:{title}, rank:{rank}}) return u", inParams)
    .then(function(inSuccess){
        return Promise.resolve(inSuccess[0][0].data);
    }, function(inFailure){
        return Promise.reject(inFailure);
    });
};

User.update = function(inParams){
    return database.query("match (u:User {id:{id}}) set u += {fields} return u", inParams)
    .then(function(inSuccess){
        return Promise.resolve(inSuccess[0][0].data);
    }, function(inFailure){
        return Promise.reject(inFailure);
    });
};

User.delete = function(inParams){
    return database.query("match (u:User {id:{id}}) detach delete u return {id:{id}} as User", inParams)
    .then(function(inSuccess){
        return Promise.resolve(inSuccess[0][0]);
    }, function(inFailure){
        return Promise.reject(inFailure);
    });
};

module.exports = User;