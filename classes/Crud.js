var Crud = {};
Crud.query = function(inDatabase, inQuery, inParams){
    return inDatabase.query(inQuery, inParams)
    .then(function(inSuccess){
            return Promise.resolve(inSuccess[0][0].data);
    }, function(inFailure){
        Promise.reject(inFailure);
    });
};

module.exports = Crud;