var sha1 = require("sha1");

var Auth = {};
Auth.Config = {};
Auth.Config.HashSecret = process.env.AUTH_SECRET
Auth.Config.KeyID = "Auth.ID";
Auth.Config.KeyIDHash = "Auth.IDHash";
Auth.Sign = function(inMessage){
	return sha1(Auth.Config.HashSecret + inMessage);
};
Auth.Verify = function(inMessage, inSignedMessage){
	if(Auth.Sign(inMessage) === inSignedMessage){
		return true;
	}else{
		return false;
	}
};
Auth.Forge = function(inID){
	return Auth.Config.KeyID+"="+inID+"; "+Auth.Config.KeyIDHash+"="+Auth.Sign(inID);
};

module.exports = Auth;