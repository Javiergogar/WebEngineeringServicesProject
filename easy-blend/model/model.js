var mongoose = require('mongoose');
var User = require('./user');
var Product= require('./product');
//var CartItem = require('./cartItem');

Model = {}

Model.user = null;


// Model.orders = [{
//   number: 1266415938008,
//   date: new Date(1995, 4, 1),
//   address: 'calle13',
//   cardHolder: 'Test',
//   cardNumber: 'numero ejemplo',
//   orderItems: [{
//     qty: 1,
//     price: 24,
//     tax: 3,
//     product: Model.products[0]
//   }, {
//     qty: 1,
//     price: 24,
//     tax: 3,
//     product: Model.products[1]
//   }]
// }, {
//   number: 1266415938009,
//   date: new Date(1997, 4, 1),
//   address: 'calle13',
//   cardHolder: 'Test',
//   cardNumber: 'numero ejemplo',
//   orderItems: [{
//     qty: 1,
//     price: 24,
//     tax: 3,
//     product: Model.products[0]
//   }, {
//     qty: 2,
//     price: 24,
//     tax: 3,
//     product: Model.products[1]
//   }]
// }
// ]



// Model._userCount = Model.users.length;
//Model._orderCount = Model.orders.length;

Model.signin = function (email, password) {
  
  return User.findOne({ email, password });
};


Model.signout = function () {

  Model.user = null;

}


// Model.buy = function (productId) {

//   producto = null;
//   existe = false;
//   //console.log(productId)
//   //console.log("Empieza el for")

//   for (var i = 0; i < Model.products.length; i++) {
//     //console.log("for")
//     if (productId == Model.products[i]._id) {
//       producto = Model.products[i]
//       //console.log(i)

//       break
//     }
//   }
//   //console.log(Model.products[i])
//   //console.log(producto)

//   for (var i = 0; i < Model.user.cartItems.length; i++) {

//     if (Model.user.cartItems[i].product._id == productId) {
//       //console.log(Model.user.cartItems[i].qty)
//       existe = true;
//       Model.user.cartItems[i].qty++;
//       //console.log(Model.user.cartItems[i].qty)

//     }
//   }
//   if (existe == false) {
//     Model.user.cartItems.push({
//       'qty': 1,
//       'product': producto
//     }
//     )
//   }
// }


Model.purchase = function (cardNumber, cardOwner, address, uid) {

  dateAux = new Date();
  cartItemsAux = [];
  numberAux = Date.now();
  var user = Model.getUserById(uid);

  order = {
    number: numberAux,
    date: dateAux,
    address: address,
    cardHolder: cardOwner,
    cardNumber: cardNumber,
    orderItems: []

  }


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

  return order

}

Model.getOrder = function (number,uid) {
  var user = Model.getUserById(uid);

  if (user) {
    for (i = 0; i < user.orders.length; i++) {
      //console.log(user.orders[i]);
      if (user.orders[i].number == number) {
        return user.orders[i];
      }
    }
  }
  else return null;
}

Model.getUserById = function (userid) {
  // for (var i = 0; i < Model.users.length; i++) {
  //   if (Model.users[i]._id == userid) {
  //     return Model.users[i];
  //   }
  // }
  // return null;
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
          console.log(user.cartItems);
          return user.save().then(function () {
          return user.cartItems; 
          })   
        }
      }
      var cartItem ={ 
        qty: 1, 
        product };

      user.cartItems.push(cartItem);
      console.log(user.cartItems);
      return Promise.all([user.save()]).then(function (result) {
        return result[0].cartItems;
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
        password: password,
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
  var user = Model.getUserById(uid);
  if (user) {
    return user.orders;
  }
  return null;
}

Model.getProducts = function (){
  
  return Product.find()
}


module.exports = Model;
