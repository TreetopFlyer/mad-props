var database = require('./neo4j');

var Contest = {};

Contest.find = function(inParams){
    return database
    .query("match (c:Contest) where id(c) = toInt({id}) return {id:id(c), open:c.open, name:c.name} as Contest", inParams)
    .then(function(inSuccess){
        return Promise.resolve(inSuccess[0][0]);
    }, function(inFailure){
        return Promise.reject(inFailure);
    });
};

Contest.create = function(inParams){
    return database
    .query("create (c:Contest {name:{name}, open:{open}}) return {id:id(c), open:{open}, name:{name}} as Contest", inParams)
    .then(function(inSuccess){
        return Promise.resolve(inSuccess[0][0]);
    }, function(inFailure){
        return Promise.reject(inFailure);
    });
};

Contest.update = function(inParams){
    return database
    .query("match (c:Contest) where id(c) = toInt({id}) set c += {fields} return {id:id(c), open:c.open, name:c.name} as Contest", inParams)
    .then(function(inSuccess){
        return Promise.resolve(inSuccess[0][0]);
    }, function(inFailure){
        return Promise.reject(inFailure);
    });
};

Contest.delete = function(inParams){
    return database
    .query("match (c:Contest) where id(c) = toInt({id}) detach delete c return {id:id(c)} as Contest", inParams)
    .then(function(inSuccess){
        return Promise.resolve(inSuccess[0][0]);
    }, function(inFailure){
        return Promise.reject(inFailure);
    });
};


module.exports = Contest;