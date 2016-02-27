Meteor.methods({
    isProd: function () {
        if (process.env.CARVICER_WEB_ENV == "production")
            return true;
        else
            return false;
    },
    //Joe
    getSearch: function(str, service){
        //search
        var ss;
        if(service == "all"){
            ss =  stores.find({"sCity":str}).fetch();
        }
        else{
            //ss = stores.find({"sCity":str, "services.service":service}).fetch();
            ss = stores.find({ $and: [{"City":str},{services: {$elemMatch: {service: service}}}]}).fetch();
        }
        return ss;
    },
    //End of Joe
    //add jack
    getTopStores: function(){
        var result;
        result =  stores.find({ }).fetch();// get all stores now? later add conditions

        return result;

    },
    getReward: function(){
        if(Meteor.user().services.reward){
            return Meteor.user().services.reward;
        }else{
            return 0;
        }
    },
    getStore: function(storeId){
        let thisStore = stores.findOne(storeId);
        //thisStore.assistantsId.forEach(function(i,item){
        //
        //});

        if(thisStore && Meteor.userId() == thisStore.ownerId){
            return true;
        }
    },

    retrieveCardList: function(){
        try{
            var retrieveCards = Meteor.wrapAsync(stripe.customers.listCards, stripe.customers);
            var result = retrieveCards(Meteor.user().services.stripeId);
            return result;
        }catch(err){
            throw new Meteor.Error(400, err.message);
        }
    },
    createCard: function(tok){
        try{
            var createCard  = Meteor.wrapAsync(stripe.customers.createSource,stripe.customers);
            var result = createCard(Meteor.user().services.stripeId,{source: tok});
        }catch(err){
            throw new Meteor.Error(400,err.message);
        }
    },
    deleteCard: function(cardId) {
        stripe.customers.deleteCard(
            Meteor.user().services.stripeId,
            cardId,
            function (err, confirmation) {
                // asynchronously called
            });
    },
    getLatLng:function(addr, city, state,zipcode){
        var geo = new GeoCoder();
        var result = geo.geocode({
            address:addr+","+ city +","+state,
            zipcode:zipcode

        });
        return result[0];
    },

    register:function(licenceNo, state, city, streetAddress, storeName, phoneNumber,zipcode){
        var sCity = city.trim();
        sCity = sCity.replace(/\s+/g, '-');
        console.log("register in");
            var output = stores.findOne({licenceNo:licenceNo});
            if (output != null)
                return -1;
            //var thisUser = Meteor.users.findOne({"emails.address":email});
            var thisId = this.userId;
        if(thisId) {
            var geo = new GeoCoder();
            var location = geo.geocode({
                address: streetAddress + "," + city + "," + state,
                zipcode: zipcode
            });
            var latLng = [location[0].longitude, location[0].latitude];


            var id = stores.insert({
                ownerId: thisId,
                storeName: storeName,
                streetAddress: streetAddress,
                city: city,
                sCity:sCity,
                state: state,
                licenceNo: licenceNo,
                authenticated: false,
                scores: 0,
                ratings: 0,
                phoneNumber: phoneNumber,
                assistantsId: [],
                loc: {
                    type: "Point",
                    coordinates: latLng
                }
            });
            var result = Meteor.users.update({_id: thisId},{$push:{"profile.myStores":{"id":id,storeName:storeName}}});
            if(result > 0){
                return id;
            }
            else{
                return -2;
            }
            //return id;
        }
        return -2;
    },
    insertOffer: function(price, message, orderId, storeId){
        //check if there is duplicated offers
        if (storeId == null || storeId == ""){
            return -2;
        }
        var previousOffer = offers.findOne({orderId:orderId, storeId:storeId});
        if (previousOffer != null)
            return -2;
        else{
            var order = orders.findOne(orderId);
            var thisUser = Meteor.users.findOne(order.userId);
            orders.update(orderId,{$push:{offeredStores:storeId}});
            var thisStore = stores.findOne({_id:storeId});
            var id = offers.insert({
                orderId: orderId,
                userId: order.userId,
                service: order.service,
                vehicle: order.vehicle,
                serviceDate: order.date,
                customerMessage: order.message,
                storeId:storeId,
                storeName:thisStore.storeName,
                storeStripeId: thisStore.stripeId,
                storeLoc: thisStore.loc,
                storeYelpId: thisStore.yelpId,
                price: price,
                message: message,
                phone:order.phoneNumber,
                email:thisUser.emails[0].address,
            },function(err){
                if (err)
                    return -1;
                else
                    return 0;
            });


        }

    },
    getOffersDetail:function(storeId){
        var allOffers = offers.find({storeId:storeId});
        var container = [];

        allOffers.forEach(function(thisOffer){
            var temp = {};
            temp["_id"] = thisOffer._id;
            temp["orderId"] = thisOffer.orderId;
            var thisOrder = orders.findOne({_id:thisOffer.orderId});
            if (thisOrder != null){
                temp["service"] = thisOrder.service;
                temp["date"] = moment(thisOrder.date, "YYYY-MM-DD HH:mm:ss ZZ").format("MM/DD/YYYY");
                temp["vehicle"] = thisOrder.vehicle;
                temp["message"] = thisOrder.message;
                container.push(temp);
            }
        });
        return container;
    },
    getRequestDetail:function(orderId){
        var thisOrder = orders.findOne({_id:orderId});
        var temp = {};
        temp = thisOrder;
        var thisUser = Meteor.users.findOne({_id:thisOrder.userId});
        temp["date"] = moment(temp["date"], "YYYY-MM-DD HH:mm:ss ZZ").format("YYYY-MM-DD");
        temp["customerName"] = thisUser.profile.firstName + " " + thisUser.profile.lastName;

        var expiredAt = thisOrder.expiredAt;
        expiredAt = moment(expiredAt, "YYYY-MM-DD HH:mm:ss ZZ");
        var timeLeft = expiredAt.diff(moment(), "minutes");

        temp["expired"] = timeLeft + " minutes";
        temp["createdAt"] = moment(temp["createdAt"]).format("MM/DD/YYYY HH:mm");
        return temp;
    },
    // getThisOfferDetail: function(offerId){
    // 	var thisOffer = offers.findOne({_id:offerId});
    // 	var thisOrder = orders.findOne({_id:thisOffer.orderId});
    // 	var temp = {};
    // 	var thisUser = Meteor.users.findOne({_id:thisOrder.userId});
    // 	temp["customerName"] = thisUser.profile.firstName + " " + thisUser.profile.lastName;
    // 	temp["vehicle"] = thisOrder.vehicle;
    // 	temp["service"] = thisOrder.service;
    // 	temp["date"] = moment(thisOrder.date, "YYYY-MM-DD HH:mm:ss ZZ").format("YYYY-MM-DD");

    // 	var expiredAt = thisOrder.expiredAt;
    // 	expiredAt = moment(expiredAt, "YYYY-MM-DD HH:mm:ss ZZ");
    // 	var timeLeft = expiredAt.diff(moment(), "minutes");

    // 	temp["expiredAt"] = timeLeft + " minutes";
    // 	return temp;
    // },
    deleteOffer:function(offerId,orderId,storeId){
        orders.update(orderId,{$pull:{offeredStores:storeId}});
        offers.remove({_id:offerId, accepted:false},function(err){
            if(err)
                throw new Meteor.Error(403,"Delete failed");
        });
    },
    updateOffer:function(offerId, price, message, userId){
       var result =  offers.update({_id:offerId, accepted:false}, {$set:{price:price,message:message,valid:true}} );
        if(result == 0){
            return false;
        }
        else{
            return true;
        }
    },
    removeAcceptedOffer:function(offerId){
        offers.remove({_id:offerId, accepted:true},function(err){
            if(err)
                throw new Meteor.Error(400,err.message);
        });
    },
    getAssistantsAndOwner:function(storeId){
        var thisStore = stores.findOne({_id:storeId});
        var storeName = thisStore.storeName;
        var assistantsId = thisStore.assistantsId;
        var ownerId = thisStore.ownerId;
        var output = [];
        var temp = {};
        var thisOwner = Meteor.users.findOne({_id:ownerId});
        temp["name"] = thisOwner.profile.firstName + " " + thisOwner.profile.lastName;
        temp["type"] = "The Owner of Store " +storeName;
        temp["id"] = thisOwner._id;
        output.push(temp);
        for (var i = 0; i < assistantsId.length; i++){
            temp = {};
            var assistant = Meteor.users.findOne({_id:assistantsId[i]});
            temp["name"] = assistant.profile.firstName + " " + assistant.profile.lastName;
            temp["type"] = "The Assistant of Store " + storeName;
            temp["id"] = assistant._id;
            output.push(temp);
        }
        return output;
    },

    saveAcct:function(storeId, firstName, lastName, dobDate, dobMonth, dobYear, type){
        var thisStore = stores.findOne(storeId);
        if(thisStore.ownerId == Meteor.user()._id){
            try{
                var updateAcct  = Meteor.wrapAsync(stripe.accounts.update,stripe.accounts);
                var result = updateAcct(thisStore.stripeId,{
                    //display_name: firstName + ' ' + lastName,
                    legal_entity: {
                        type: type,
                        first_name: firstName,
                        last_name: lastName,
                        dob:{
                            day: dobDate,
                            month: dobMonth,
                            year: dobYear
                        },
                        additional_owners: ''
                    },
                    tos_acceptance:{
                        ip: this.connection.clientAddress,
                        date: Math.floor(Date.now() / 1000)
                    }

                });
                return result;
            }catch(err){
                throw new Meteor.Error(400,err.message);
            }

        }else
            throw new Meteor.Error(403,"You are not store owner");
    },
    saveBankAcct:function(storeId, token){
        var thisStore = stores.findOne(storeId);
        if(thisStore.ownerId == Meteor.user()._id){
            try{
                var saveBankAcct  = Meteor.wrapAsync(stripe.accounts.createExternalAccount,stripe.accounts);
                var result = saveBankAcct(thisStore.stripeId ,{external_account: token});
                return result;
            }catch(err){
                throw new Meteor.Error(400,err.message);
            }
        }else
            throw new Meteor.Error(403,"You are not store owner");
    },
    retrieveAcct: function(storeId){
        var thisStore = stores.findOne(storeId);
        if(thisStore.ownerId == Meteor.user()._id){
            try{
                var retrieveAcct  = Meteor.wrapAsync(stripe.accounts.retrieve,stripe.accounts);
                var result = retrieveAcct(thisStore.stripeId);
                return result;
            }catch(err){
                throw new Meteor.Error(400,err.message);
            }
        }else
            throw new Meteor.Error(403,"You are not store owner");
    },
    retrieveBankAcct: function(storeId){
        var thisStore = stores.findOne(storeId);
        if(thisStore.ownerId == Meteor.user()._id){
            try{
                var retrieveBankAcct  = Meteor.wrapAsync(stripe.accounts.retrieve,stripe.accounts);
                var result = retrieveBankAcct(thisStore.stripeId);
                return result;
            }catch(err){
                throw new Meteor.Error(400,err.message);
            }
        }else
            throw new Meteor.Error(403,"You are not store owner");
    },
    addAssistant:function(storeId,email,name){
        var store = stores.findOne(storeId);
        if(store.staffList){
            var flagRepeat = store.staffList.map(function(one){
                return one.email;
            }).indexOf(email);
        }
        else{
            var flagRepeat = -1;
        }


        if(flagRepeat == -1) {
            var tmpStaff = Meteor.users.findOne({"emails.address": email});
            var staff = {id: tmpStaff._id, email: tmpStaff.emails[0].address, name: name};
            var sNum = stores.update({_id: storeId}, {$push: {staffList: staff}});
            //if success
            if (sNum > 0) {

                var num = Meteor.users.update({"emails.address": email}, {
                    $push: {
                        "profile.myStores": {
                            "id": store._id,
                            storeName: store.storeName
                        }
                    }
                });
                return num;
            }
        }
    },
    deleteAssistant:function(storeId,assistantId){
        stores.update({_id:storeId},{$pull:{assistantsId:assistantId}},{multi:true});
    },
    addService:function(storeId,id,service,price,detail){
        stores.update(storeId, {
            $push:{ "services": {
                "id": id,
                "service": service,
                "price": price,
                "detail": detail
            }
            }
        },function(err,updated){
            if(err)
                throw new Meteor.Error(400);
            else
                return true;
        });
    },
    deleteService:function(storeId,id){
        stores.update(storeId, {
            $pull:{ "services": {
                "id": id,
            }
            }
        },function(err,updated){
            if(err)
                throw new Meteor.Error(400);
            else
                return true;
        });
    },
    // getAllTransactions:function(storeId){
    // 	var allTrans = transactions.find({storeId:storeId},{status:1});
    // 	var output = [];
    // 	allTrans.forEach(function(thisTransaction){
    // 		var temp = {};
    // 		var thisOrder = orders.findOne({_id:thisTransaction.orderId});
    // 		if (thisOrder != null){
    // 			temp["vehicle"] = thisOrder.vehicle;
    // 			temp["serviceDate"] = moment(thisOrder.date, "YYYY-MM-DD ZZ").format("YYYY-MM-DD");
    // 			temp["service"] = thisOrder.service;
    // 			temp["status"] = thisTransaction.status;
    // 			temp["transactionId"] = thisTransaction._id;
    // 			output.push(temp);
    // 		}
    // 	});
    // 	return output;
    // },
    // getThisTransaction:function(transactionId){
    // 	var output = [];
    // 	var temp = {};
    // 	var thisTransaction = transactions.findOne({_id:transactionId});
    // 	var thisOrder = orders.findOne({_id:thisTransaction.orderId});
    // 	var customer = Meteor.users.findOne({_id:thisOrder.userId});
    // 	temp["customerName"] = customer.profile.firstName + " " + customer.profile.lastName;
    // 	temp["vehicle"] = thisOrder.vehicle;
    // 	temp["serviceDate"] = moment(thisOrder.date, "YYYY-MM-DD ZZ").format("YYYY-MM-DD");
    // 	temp["service"] = thisOrder.service;
    // 	temp["status"] = thisTransaction.status;
    // 	temp["transactionId"] = thisTransaction._id;
    // 	output.push(temp);
    // 	return output;
    // },
    checkTransaction:function(transactionId){
        transactions.update({_id:transactionId}, {$set:{status:"completed"}});
    },
    adminPass: function(password){
        if(password=="vrf")
            return true;
        else
            return false;
    },
    verifyStore: function(id, pass){
        if(pass=="vrf"){
            try{
                var thisStore = stores.findOne(id);
                var thisOwner = Meteor.users.findOne(thisStore.ownerId)
                var createAccount  = Meteor.wrapAsync(stripe.accounts.create,stripe.accounts);
                var result = createAccount({
                    managed: true,
                    country: 'US',
                    default_currency: "usd",
                    email: thisOwner.emails[0].address
                });
            }catch(err){
                throw new Meteor.Error(400,err.message);
            }
            stores.update({_id:id},{$set:{
                authenticated:true,
                stripeId: result.id
            }},function(err,store){
                if(err)
                    throw new Meteor.Error(400,err.message);
                else{
                    Meteor.users.findOne(store.ownerId,function(err,thisUser){
                        if(!err){
                            process.env.MAIL_URL="smtp://support@carvicer.com:GlhTyISlt4mF@carvicer.com:465/";
                            Email.send({
                                to: thisUser.emails[0].address,
                                //to:"clarehuang1126@gmail.com",
                                from: 'Carvicer<support@carvicer.com>',
                                subject: 'Your order has been processed',
                                html:'<div style="width:540px;border:solid 1px black;"> <div class="header" style="width:540px;padding:60px 0 30px 0;display:inline-block;border-bottom:solid 1px black;text-align:center;"> <img src="http://carvicer.com:3001/logo2.jpg" style="width:50px;height:50px;border-radius:50%;margin-right:15px;"> <h2 style="-webkit-margin-before:0;-webkit-margin-after:0;padding:15px 0 5px 0;font-family:futura;">Your Registration Has Been Approved</h2> <p style="-webkit-margin-before:3px;-webkit-margin-after:3px;padding-left:5px;font-family:avenir;">Now you can login by your e-mail</p></div><div> <p style="font-family:avenir;padding:20px;"> To <span style="font-weight:bold;font-style:italic;">Abc Oil Changer</span> : <br><br>Thank you for using Carvicer. The next step, please <span style="font-weight:bold;font-style:italic;">add your bank account</span>. <br><br></p></div><div style="text-align:right;"> <h4 style="font-family:futura;padding-right:20px;">Carvicer.com</h4> </div></div>'
                            });
                        }
                    })

                }
            });
        }
    },
    checkReceiptCode: function(code) {
        var offer = offers.findOne({receiptCode: code});
        if(offer){
            let num = offers.update({receiptCode: code}, { $set: {canConfirm: true }});
            if (num == 0) return 'No such receipt code!';
            else return offer._id;
        }

    },
    addTrans:function(id){
        var offer = offers.findOne(id);
        if(offer){
            var result = transactions.insert({
                userId: offer.userId,
                userEmail: Meteor.user().emails[0].address,
                userName: offer.userName,
                storeId: offer.storeId,
                storeStripeId: offer.storeStripeId,
                storeName: offer.storeName,
                service: offer.service,
                vehicle: offer.vehicle,
                serviceDate: offer.serviceDate,
                price: offer.price,
                customerMsg:offer.customerMessage,
                storeMsg: offer.message,
                paid: true,
                canceled: false,
                createdAt:moment().format(),
                offer:offer,
            });
            if(result){
                offers.remove(id);
            }
            return result;
        }
    },
    addLanguage:function(id, language){
        let store = stores.findOne(id);
        if(store.languages){
            var flagRepeat = store.languages.indexOf(language);// if not exist return -1
        }
        else{
            var flagRepeat = -1;
        }


        if(flagRepeat == -1) {
            var num =  stores.update({_id:id},{$push:{languages:language}});
            return num;
        }
    },
    delLanguage:function(id, language){
        let store = stores.findOne(id);
        if(store.languages){
            var flagRepeat = store.languages.indexOf(language);// if not exist return -1
        }
        else{
            var flagRepeat = -1;
        }


        if(flagRepeat != -1) {
            var num =  stores.update({_id:id},{$pull:{languages:language}});
            return num;
        }
    }
});
