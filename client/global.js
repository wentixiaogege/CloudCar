Template.registerHelper('formatdate',function(datetime){
    if(moment && datetime){
        return moment(datetime).format('MM/DD/YYYY');
    } else{
        return datetime;
    }
});

Template.registerHelper('formatdateMMDD',function(datetime){
    if(moment && datetime){
        return moment(datetime).format('MM/DD');
    } else{
        return datetime;
    }
});

Template.registerHelper('formatdatetime', function(datetime){
    if (moment && datetime) {
        if(datetime.getDate() === new Date().getDate()){
            return "Today " + moment(datetime).format("hh:mm");
        } else{
            return moment(datetime).format("MM/DD/YYYY hh:mm");
        }

    }
    else {
        return datetime;
    }
});