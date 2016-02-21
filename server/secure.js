Images.allow({
    insert:function(userId,doc){
        return true;
    },
    update:function(userId,project,fields,modifier){
        return true;
    },
    remove:function(userId,project){
        return true;
    },
    download:function(){
        return true;
    }
});