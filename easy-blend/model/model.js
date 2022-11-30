var mongoose = require('mongoose');
var bcryptjs = require('bcryptjs');
var User = require('./user');
var Product= require('./product');
var Order= require('./order');


Model = {}

Model.user = null;


Model.signin = function (email, password) {
  
  return User.findOne({ email, password });
};


Model.signout = function () {

  Model.user = null;

}



Model.purchase = function (cardNumber, cardOwner, address, uid) {

  return User.findById(uid).populate({
    path:'cartItems',
    populate:'product'
  }).then(function(user){
    if(user){

      dateAux = new Date();
      cartItemsAux = [];
      numberAux = Date.now();
      
    
      var order = new Order({
        number: numberAux,
        date: dateAux,
        address: address,
        cardHolder: cardOwner,
        cardNumber: cardNumber,
        orderItems: []
    
      });
    
    
      //console.log(user)
      for (i = 0; i < user.cartItems.length; i++) {
        priceaux = user.cartItems[i].product.price;
        taxaux = user.cartItems[i].product.tax;
    
    
    
        order.orderItems.push({
          qty: user.cartItems[i].qty,
          price: priceaux,
          tax: taxaux,
          product: user.cartItems[i].product
        });
    
      }
    
    
      user.orders.push(order)
    
      numCI = user.cartItems.length;
      for (i = 0; i < numCI; i++) {
        user.cartItems.pop();
      }
      
      return user.save().then(function (){
        return order.save().then(function(){
          return order
        })
      });
      

    }
    else return null;
  }).catch(function (err) { console.error(err); return null; });


}

Model.getOrder = function (number,uid) {

  return User.findById(uid).populate({
    path:'orders',
    populate:{
      path:'orderItems',
      populate:'product'
    }
  }).then(function(user){
    if(user){
      for (i = 0; i < user.orders.length; i++) {
        //console.log(user.orders[i]);
        if (user.orders[i].number == number) {
          //console.log(user.orders[i]);
          return user.orders[i];
        }
      }
    }
    return null;
  })

}

Model.getUserById = function (userid) {
  return User.findById(userid).then(function(user){
    if(user){
      return user;
    }
    else return null;
  })

};


Model.getCartQty = function(uid){
  var qty=0;
  return User.findById(uid).then(function(user){
    if(user){
      for(i=0;i<user.cartItems.length;i++){
        qty=qty + user.cartItems[i].qty;
      }
      return qty
    }
  })
}

Model.getProductById = function (pid) {
 
  return Product.findById(pid).then(function(product){
    if(product){
      return product;
    }
    else return null;
  })
};

Model.addItem = function (uid, pid) {
  return Promise.all([User.findById(uid), Product.findById(pid)]).then(function (results) {
    var user = results[0];
    var product = results[1];
    if (user && product) {
      for (var i = 0; i < user.cartItems.length; i++) {
        var cartItem = user.cartItems[i];
        if (cartItem.product == pid) {
          cartItem.qty++;
          //console.log(user.cartItems);
          return user.save().then(function () {
          return user.cartItems; 
          })   
        }
      }
      var cartItem ={ 
        qty: 1, 
        product };

      user.cartItems.push(cartItem);
      //console.log(user.cartItems);
      return user.save().then(function () {
        return user.cartItems;
      });
    }
    return null;
  }
    ).catch(function (err) { console.error(err); return null; });
};

Model.getCartByUserId = function (uid) {

  return User.findById(uid).populate({
    path:'cartItems',
    populate:'product'
  }).then(function(user){
    if(user){
      //console.log(user.cartItems);
      return user.cartItems;
    }
  })
}

Model.removeItem = function (uid, pid, all = false) {
  return Promise.all([User.findById(uid), Product.findById(pid)]).then(function (results) {
      var user = results[0];
      var product = results[1];
      if (user && product) {
          for (var i = 0; i < user.cartItems.length; i++) {
              var cartItem = user.cartItems[i];
              if (cartItem.product == pid) {
                  if (!all && cartItem.qty > 1) {
                      cartItem.qty--;
                  } else {
                      user.cartItems.splice(i, 1);
                  }
                  return user.save().then(function () {
                      return user.cartItems;
                  });
              }
          }
      }
      return null;
  }).catch(function (err) { console.error(err); return null; });
};


Model.signup = function (name, surname, address, birth, email, password) {
  return User.findOne({ email }).then(function (user) {
    if (!user) {
      var user = new User({
        email: email,
        password: bcryptjs.hashSync(password, bcryptjs.genSaltSync()),
        name: name,
        surname: surname,
        birth: (new Date(birth)).getTime(),
        address: address,
        cartItems: []
      });
      return user.save();
    }
    return null;
  });
};

Model.getOrdersByUserId = function (uid) {
  return User.findById(uid).populate('orders').then(function(user){
    if(user){
      //console.log(user.cartItems);
      
      return user.orders;
    }
    return null;
  })
}

Model.getProducts = function (){
  
  return Product.find()
}


module.exports = Model;
