var database = require('./neo4j');

var Contest = {};

Contest.find = function(inParams){
    return database.query("match (c:Contest {id:{id}}) return c", inParams)
    .then(function(inSuccess){
        return Promise.resolve(inSuccess[0][0].data);
    }, function(inFailure){
        return Promise.reject(inFailure);
    });
};

Contest.create = function(inParams){
    return database.query("create (c:Contest {name:{name}, open:{open}, id:{id}}) return c", inParams)
    .then(function(inSuccess){
        return Promise.resolve(inSuccess[0][0].data);
    }, function(inFailure){
        return Promise.reject(inFailure);
    });
};

Contest.update = function(inParams){
    return database.query("match (c:Contest {id:{id}}) set c += {fields} return c", inParams)
    .then(function(inSuccess){
        return Promise.resolve(inSuccess[0][0].data);
    }, function(inFailure){
        return Promise.reject(inFailure);
    });
};

Contest.delete = function(inParams){
    return database.query("match (c:Contest {id:{id}}) detach delete c return {data:{id:{id}}} as Contest", inParams)
    .then(function(inSuccess){
        return Promise.resolve(inSuccess[0][0].data);
    }, function(inFailure){
        return Promise.reject(inFailure);
    });
};

module.exports = Contest;