var database = require('./neo4j');

var User = {};

User.find = function(inParams){
    return database.query("match (u:User {identity:{identity}}) return u", inParams)
    .then(function(inSuccess){
        if(inSuccess.length == 1){
            return Promise.resolve(inSuccess[0][0].data);
        }else{
           return Promise.reject({exception:'user not found'});
        }
    }, function(inFailure){
        Promise.reject(inFailure);
    });
};

User.create = function(inParams){
    return database.query("create (u:User {identity:{identity}, name:{name}, title:{title}, rank:{rank}}) return u", inParams)
    .then(function(inSuccess){
        return Promise.resolve(inSuccess[0][0].data);
    }, function(inFailure){
        return Promise.reject(inFailure);
    });
};

User.update = function(inParams){
    return database.query("match (u:User {identity:{identity}}) set u += {fields} return u", inParams)
    .then(function(inSuccess){
        return Promise.resolve(inSuccess[0][0].data);
    }, function(inFailure){
        return Promise.reject(inFailure);
    });
};

User.delete = function(inParams){
    return database.query("match (u:User {identity:{identity}}) detach delete u return {id:id(u)} as User", inParams)
    .then(function(inSuccess){
        return Promise.resolve(inSuccess);
    }, function(inFailure){
        return Promise.reject(inFailure);
    });
};

module.exports = User;