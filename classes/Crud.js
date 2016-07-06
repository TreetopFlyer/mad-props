var Crud = function(inDatabase, inObj){
    this.database = inDatabase;
    this.cypher = inObj;
};
Crud.prototype.locate = function(inParams){
    return Crud.query(this.database, this.cypher.locate, inParams);
};
Crud.prototype.create = function(inParams){
    return Crud.query(this.database, this.cypher.create, inParams);
};
Crud.prototype.update = function(inParams){
    return Crud.query(this.database, this.cypher.update, inParams);
};
Crud.prototype.delete = function(inParams){
    return Crud.query(this.database, this.cypher.delete, inParams);
};
///////////////////
Crud.query = function(inDatabase, inQuery, inParams){
    return inDatabase.query(inQuery, inParams)
    .then(function(inSuccess){
        return Promise.resolve(inSuccess[0][0].data);
    }, function(inFailure){
        return Promise.reject(inFailure);
    });
};
module.exports = Crud;