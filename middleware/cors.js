var router = require('express').Router();

router.use(function(inReq, inRes, inNext){
    inRes.header('Access-Control-Allow-Origin', '*');
    inRes.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    inRes.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if(inReq.method == 'OPTIONS'){
        inRes.send(200);
    }else{
        inNext();
    }
});

module.exports = router;