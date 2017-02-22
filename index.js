const o = require('odata');
// https://www.npmjs.com/package/odata
// https://github.com/janhommes/o.js/tree/master
// http://www.odata.org/blog/OData-JavaScript-library-o.js-explained/

o('http://services.odata.org/V4/OData/OData.svc/Products').get((data) => {
  console.log(data); //returns an array of Product data 
});

o('http://services.odata.org/V4/OData/OData.svc/Products').take(5).skip(2).get((data) => {
  console.log(data); //An array of 5 products skipped by 2 
});

//--- 

var oHandler = o('http://services.odata.org/V4/(S(wptr35qf3bz4kb5oatn432ul))/TripPinServiceRW/People');
oHandler.get(function(data) {
    console.log(data); // data of the TripPinService/People endpoint
});

o('http://services.odata.org/V4/(S(wptr35qf3bz4kb5oatn432ul))/TripPinServiceRW/People(\'Russell Whyte\')').get().then(function(result) {
    result.data.FirstName = 'New Name';
    return(result.save());
}).then(function(result) {
    console.log('First name is now New Name');
});

o().config({
    endpoint: 'http://services.odata.org/V4/(S(ms4wufavzmwsg3fjo3eqdgak))/TripPinServiceRW/'
});

   o('People').post({
            UserName:'name',
            FirstName:'foo',
            LastName:'bar'
    }).save().then(function(result) {
        // Because o.js does not know which key to use, you need to initialize a new handler
        var oHandler = o('People')
            .find(('\'' + result.data.UserName + '\''))
            .patch({ FirstName: 'new name' });
        return(oHandler.save());
    }).then(function(result) {
        result.delete();
        return(result.save());
    }).then(function() {
       console.log('A person was added, modified and deleted.');
    });
