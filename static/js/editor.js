var Editor = angular.module("Editor", []);
Editor.factory("Editor", ["$http", function(inHTTP){
    var obj = {};
    obj.Create = function(inConfig){
        var Editor = {};
        Editor.All = [];
        /*
        {
            Model:{
                id:0,
                name:"",
                title:"",
                rank:"user"
            },
            Endpoint:'/admin/user'
        }
        */
        Editor.Config = inConfig;
        Editor.Constructor = function(inDataType){
            var user = {};
            user.original = inDataType;
            user.edited = {};
            user.transfer = function(inFrom, inTo){
                for(prop in Editor.Config.Model){
                    inTo[prop] = angular.copy(inFrom[prop]);
                }
            };
            user.read = function(){
                user.transfer(user.original, user.edited);
            };
            user.write = function(){
                user.transfer(user.edited, user.original);
            };
            user.status = {
                editing:false,
                processing:false,
            }

            user.read();
            return user;
        };
        Editor.Seed = function(inArray){
            var i;
            for(i=0; i<inArray.length; i++){
                Editor.All.push(Editor.Constructor(inArray[i]));
            }
        };
        Editor.Download = function(){
            inHTTP({method:'GET', url:Editor.Config.Endpoint})
            .then(function(inSuccess){
                Editor.Seed(inSuccess.data);
            }, function(inFailure){
                console.log(inFailure);
            });
        };
        Editor.Create = function(inDataType){
            if(inDataType.status.processing)
                return;

            inDataType.status.processing = true;
            inHTTP({method:'POST', url:Editor.Config.Endpoint, headers:{'Content-Type':'application/json'}, data:inDataType.edited})
            .then(function(inSuccess){
                inDataType.status.processing = false;
                inDataType.status.editing = false;
                inDataType.read();
                Editor.All.unshift(Editor.Constructor(inDataType.edited));
            }, function(inFailure){
                inDataType.status.processing = false;
                console.log(inFailure);
            });
        };
        Editor.Update = function(inDataType){
            if(inDataType.status.processing)
                return;

            inDataType.status.processing = true;
            inHTTP({method:'PUT', url:Editor.Config.Endpoint, headers:{'Content-Type':'application/json'}, data:inDataType.edited})
            .then(function(inSuccess){
                inDataType.status.processing = false;
                inDataType.status.editing = false;
                inDataType.write();
            }, function(inFailure){
                inDataType.status.processing = false;
                console.log(inFailure);
            });
        };
        Editor.Delete = function(inDataType){
            if(inDataType.status.processing)
                return;

            inHTTP({method:'DELETE', url:Editor.Config.Endpoint, headers:{'Content-Type':'application/json'}, data:{id:inDataType.original.id}})
            .then(function(inSuccess){
                var i;
                for(i=0; i<Editor.All.length; i++){
                    if(Editor.All[i].original.id == inDataType.original.id){
                        Editor.All.splice(i, 1);
                        return;
                    }
                }
                inDataType.status.processing = false;
                inDataType.status.editing = false;

            }, function(inFailure){
                console.log(inFailure);
                inDataType.status.processing = false;
                inDataType.status.editing = false;
            });
        };
        Editor.Pending = Editor.Constructor(Editor.Config.Model);
        return Editor;
    };

    return obj;
}]);