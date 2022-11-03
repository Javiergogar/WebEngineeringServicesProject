Model = {}
Model.products = [{
    _id: 1,
    title: 'Trio blender',
    description: 'This is a pack to save some money',
    url: 'images/trio_blend.jpg',
    price: 180,
    tax: 9.66
  }, {
    _id: 2,
    title: 'Pink blender',
    description: 'This is a nice and happy blender. If you use this you will brighten your days',
    url: 'images/pink_blend.jpg',
    price: 90,
    tax: 9.66
  },
  {
    _id: 3,
    title: 'Pink Pro Blender',
    description: 'This is like Pink Blender but for professionals.',
    url: 'images/pink_pro_blend.jpg',
    price: 100,
    tax: 9.66
  },
  {
    _id: 4,
    title: 'Duo blender',
    description: 'Two for the price of one.',
    url: 'images/duo_blend.png',
    price: 90,
    tax: 9.66
  },
  {
    _id: 5,
    title: 'Duo blender 2',
    description: 'Two for the price of one, second version.',
    url: 'images/duo2_blend.jpg',
    price: 90,
    tax: 9.66
  },
  {
    _id: 6,
    title: 'Pack blender',
    description: 'Big pack blenders.',
    url: 'images/pack_blend.jpg',
    price: 280,
    tax: 9.66
  },
  {
    _id: 7,
    title: 'Blender pieces',
    description: 'Jack El Destripador´s favourite. Easy to assemble and disassemble.',
    url: 'images/blend_pieces.jpg',
    price: 90,
    tax: 9.66
  },
  {
    _id: 8,
    title: 'Green blender',
    description: 'This is a nice and cheap with a beautiful color blender but green. It´s very good for smoothies.',
    url: 'images/green_blend.jpg',
    price: 80,
    tax: 9.66
  }
  ];
  Model.user = null;
  Model.users = [{
    _id: 1,
    email: 'test@gmail.com',
    password: 'test',
    name: 'Test',
    surname: 'test',
    birthdate: new Date(1995, 4, 1),
    address: '123 Main St, 12345 New York, USA',
    cartItems: [{
      qty: 2,
      product: Model.products[0]
    }, {
      qty: 1,
      product: Model.products[1]
    }],
    orders: []
  
  }];
  
  Model.orders = [{
    number: 1266415938008,
    date: 'fecha ejemplo',
    address: 'calle13',
    cardHolder: 'Test',
    cardNumber: 'numero ejemplo',
    orderItems: [{
      qty: 1,
      price: 24,
      tax: 3,
      product: Model.products[0]
    }, {
      qty: 1,
      price: 24,
      tax: 3,
      product: Model.products[1]
    }]
  }, {
    number: 1266415938009,
    date: 'fecha ejemplo',
    address: 'calle13',
    cardHolder: 'Test',
    cardNumber: 'numero ejemplo',
    orderItems: [{
      qty: 1,
      price: 24,
      tax: 3,
      product: Model.products[0]
    }, {
      qty: 2,
      price: 24,
      tax: 3,
      product: Model.products[1]
    }]
  }
  ]
  
  
  
  Model._userCount = Model.users.length;
  Model._orderCount = Model.orders.length;
  
  Model.signin = function (email, password) {

    Model.user = null;
    //console.log(Model.user)
    for (var i = 0; i < Model.users.length; i++) {
        console.log("a")
        if (Model.users[i].email == email && Model.users[i].password == password)
            //console.log(Model.users[i])
            return Model.users[i];  //antes solo podia haber uno logueado, ahora pueden haber mas a la vez
    }
    return null;
}
  
  
  Model.signout = function () {
  
    Model.user = null;
  
  }
  
  
  Model.signup = function (name, surname, address, birth, email, password) {
    console.log(Model.users);
    Model.user = null;
    existe = false;
    for (var i = 0; i < Model.users.length; i++) {
      console.log(Model.users[i].email)
      if (Model.users[i].email == email) {
        console.log("This email is already registered.");
        existe = true;
      }
    }
  
    if (existe) {
      return null
    }
    else {
      return Model.users.push({
        '_id': Model._userCount++,
        'email': email,
        'password': password,
        'name': name,
        'surname': surname,
        'birthdate': new Date(birth),
        'address': address,
        'cartItems': [],
        'orders': [],
      }
      )
    }
  }
  
  
  Model.buy = function (productId) {
  
    producto = null;
    existe = false;
    //console.log(productId)
    //console.log("Empieza el for")
  
    for (var i = 0; i < Model.products.length; i++) {
      //console.log("for")
      if (productId == Model.products[i]._id) {
        producto = Model.products[i]
        //console.log(i)
  
        break
      }
    }
    //console.log(Model.products[i])
    //console.log(producto)
  
    for (var i = 0; i < Model.user.cartItems.length; i++) {
  
      if (Model.user.cartItems[i].product._id == productId) {
        //console.log(Model.user.cartItems[i].qty)
        existe = true;
        Model.user.cartItems[i].qty++;
        //console.log(Model.user.cartItems[i].qty)
  
      }
    }
    if (existe == false) {
      Model.user.cartItems.push({
        'qty': 1,
        'product': producto
      }
      )
    }
  }
  
  
  Model.purchase = function (cardNumber, cardOwner, address) {
  
    dateAux = new Date();
    cartItemsAux = [];
    numberAux = Date.now();
  
    order = {
      number: numberAux,
      date: dateAux,
      address: address,
      cardHolder: cardOwner,
      cardNumber: cardNumber,
      orderItems: []
  
    }
  
  
  
    for (i = 0; i < Model.user.cartItems.length; i++) {
      priceaux = Model.user.cartItems[i].product.price;
      taxaux = Model.user.cartItems[i].product.tax;
  
  
  
      order.orderItems.push({
        qty: Model.user.cartItems[i].qty,
        price: priceaux,
        tax: taxaux,
        product: Model.user.cartItems[i].product
      });
  
    }
  
  
    Model.user.orders.push(order)
  
    numCI = Model.user.cartItems.length;
    for (i = 0; i < numCI; i++) {
      Model.user.cartItems.pop();
    }
  
    return order
  
  }
  
  Model.getOrder = function (number) {
    if (Model.user) {
      for (i = 0; i < Model.user.orders.length; i++) {
        //console.log(Model.user.orders[i]);
        if (Model.user.orders[i].number == number) {
          return Model.user.orders[i];
        }
      }
    }
    else return null;
  }

  Model.getUserById = function (userid) {
    for (var i = 0; i < Model.users.length; i++) {
      if (Model.users[i]._id == userid) {
        return Model.users[i];
      }
    }
    return null;
  };
  
  Model.getCartQty = function (uid) {
    var user = Model.getUserById(uid);
    if (user) {
      var count = 0;
      for (var i = 0; i < user.cartItems.length; i++) {
        count += user.cartItems[i].qty;
        
      }
      return count;
    }
    return null;
  };

  Model.getProductById = function (pid) {
    for (var i = 0; i < Model.products.length; i++) {
      if (Model.products[i]._id == pid) {
        return Model.products[i];
      }
    }
    return null;
  };

  Model.addItem = function (uid, pid) {
    var product = Model.getProductById(pid);
    var user = Model.getUserById(uid);
    if (user && product) {
      for (var i = 0; i < user.cartItems.length; i++) {
        var cartItem = user.cartItems[i];
        if (cartItem.product._id == pid) {
          cartItem.qty++;
          return user.cartItems;
        }
      }
      var cartItem = {
        _id: Model._cartItemsCount++,
        product: product,
        qty: 1
      };
      user.cartItems.push(cartItem);
      //Model.cartItems.push(cartItem);
      return user.cartItems;
    }
    return null;
  };

  Model.getCartByUserId = function (uid) {
    var user = Model.getUserById(uid);
    if (user) {
      return user.cartItems;
    }
    return null;
  }

  Model.removeItem = function(uid, pid, all = false) {
    var user = Model.getUserById(uid);
    if (user) {
      for (var i = 0; i < user.cartItems.length; i++) {
        var item = user.cartItems[i];
        if (item.product._id == pid) {
          if (!all && (item.qty > 1)) {
            item.qty--;
          } else {
            user.cartItems.splice(i, 1);
            //Model.cartItems.splice(Model.cartItems.indexOf(item), 1);
          }
          return user.cartItems;
        }
      }
    }
    return null;
  };

  module.exports = Model;
  