var database = require('./neo4j');
module.exports = new database.Crud({
    create:"create (c:Contest {name:{name}, open:{open}, id:{id}}) return c",
    locate:"match (c:Contest {id:{id}}) return c",
    update:"match (c:Contest {id:{id}}) set c += {fields} return c",
    delete:"match (c:Contest {id:{id}}) detach delete c return {data:{id:{id}}} as Contest"
});