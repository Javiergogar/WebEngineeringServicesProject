function render(url, container, context) {
  return $.ajax({
    url: url,
    method: 'GET'
  }).done(function (source) {
    var template = Handlebars.compile(source);
    var html = template(context);
    $(container).html(html);
  }).fail(function (error) {
    console.error('GET ', url, error);
  });
}
function navigateTo(event, url) {
  event.preventDefault();
  history.pushState(null, '', url);
  route();
}
function route() {
  var path = location.pathname;
  var matches = null;
  var templates = ['signin', 'cart', 'order', 'profile', 'signup', 'index', 'purchase'];
  var context = { user: Model.getUserId(), messages: { success: Messages.success, danger: Messages.danger } }; 
  Messages.clear();
  var cartQtyP = Model.getCartQty().done(function (cartQty) {
    context.cartQty = cartQty;
  }).fail(function () {
    console.error('Cannot retrieve cart quantity');
  });
  console.log('ROUTING ', path);
  if (matches = path.match(/^\/$/)) {
    var productsP = Model.getProducts().done(function (products) {
      context.products = products;
    }).fail(function () {
      console.error('Cannot retrieve products');
    });
    $.when(cartQtyP, productsP).always(function () {
      render('/templates/index.hbs', '#content', context)
    });
  } else if (matches = path.match(/^\/order\/id\/([0-9^\/]+)\/?$/)) {
    var order = Model.getOrder(matches[1]); //aqui abra que poner una promise
    context.order = order;
    if (order) {
      $.when(cartQtyP).always(function () {
        render('/templates/order.hbs', '#content', context);
      });
    } else {
      $.when(cartQtyP).always(function () {
        render('/templates/not-found.hbs', '#content', context);
      });
    }
  } else if (matches = path.match(/^\/cart\/?$/)) {
    console.log("Ruteo con context")
    var cartP = Model.getCart().done(function (cart) {
      context.cartItems = cart;
    }).fail(function () {
      console.error('Cannot retrieve cart');
    });
    $.when(cartQtyP, cartP).always(function () {
      render('/templates/cart.hbs', '#content', context);
    });

  } 
  else if (matches = path.match(/^\/profile\/?$/)) {
    console.log("Ruteo con context")
    var profileP = Model.getProfile().done(function (profile) {
      context.user = profile;
      //console.log(context.user);
    }).fail(function () {
      console.error('Cannot retrieve profile');
    });
    $.when(cartQtyP, profileP).always(function () {
      render('/templates/profile.hbs', '#content', context);
    });

  }
  else if ((matches = path.match(/^\/([^\/]*)\/?$/)) && templates.includes(matches[1])) {
    console.log("Ruteo sin context")
    $.when(cartQtyP).always(function () {
      render('/templates/' + matches[1] + '.hbs', '#content', context);
    });
  } else {
    $.when(cartQtyP).always(function () {
      render('/templates/not-found.hbs', '#content', context);
    });
  }
}

function loadPartial(url, partial) {
  return $.ajax({
    url: url,
    method: 'GET'
  }).done(function (source) {
    Handlebars.registerPartial(partial, source);
  }).fail(function (error) {
    console.error('GET ', url, error);
  });
}

$(function () {
  Handlebars.registerHelper('formatPrice', function (price) {
    var result = (Math.round(price * 100) / 100).toFixed(2) + ' €';
    return new Handlebars.SafeString(result);
  });
  Handlebars.registerHelper('totalCartItem', function (qty, price) {
    var result = qty * price;
    return new Handlebars.SafeString(result);
  });
  
  Handlebars.registerHelper('subtotalOrderItem', function (qty, price) {
    var result = qty * price

    return new Handlebars.SafeString(result);
  });
  Handlebars.registerHelper('subtotalOrder', function (orderItems) {
    var result = 0

    for (i = 0; i < orderItems.length; i++) {
      result = result + (orderItems[i].qty * orderItems[i].price)
    }

    return new Handlebars.SafeString(result);
  });
  Handlebars.registerHelper('taxOrder', function (orderItems) {
    var result = 0

    for (i = 0; i < orderItems.length; i++) {
      result = result + (orderItems[i].qty * orderItems[i].tax)
    }

    return new Handlebars.SafeString(result);
  });
  Handlebars.registerHelper('totalOrder', function (orderItems) {
    var result = 0

    for (i = 0; i < orderItems.length; i++) {
      result = result + (orderItems[i].qty * orderItems[i].tax) + (orderItems[i].qty * orderItems[i].price);
    }

    return new Handlebars.SafeString(result);
  });
  
  Handlebars.registerHelper('subtotalCartItem', function (cartItems) {
    var result = 0;
    
      for (var i = 0; i < cartItems.length; i++) {
        
        result = result + (cartItems[i].qty * cartItems[i].product.price)
      }
      return new Handlebars.SafeString(result); 
  });

  Handlebars.registerHelper('taxesCartItem', function (cartItems) {
    var result = 0

    for (var i = 0; i < cartItems.length; i++) {
      result = result + (cartItems[i].qty * cartItems[i].product.tax)
    }

    return new Handlebars.SafeString(result);
  });

  Handlebars.registerHelper('totalCart', function (cartItems) {
    var result = 0
    
    

    for (var i = 0; i < cartItems.length; i++) {
      result = result + (cartItems[i].qty * cartItems[i].product.tax) + (cartItems[i].qty * cartItems[i].product.price)
    }
    var result = (Math.round(result * 100) / 100).toFixed(2) + ' €';

    return new Handlebars.SafeString(result);
  });
  Handlebars.registerHelper('navCartItem', function () {
    var result = 0

    for (var i = 0; i < Model.user.cartItems.length; i++) {
    }
    result = i;

    return new Handlebars.SafeString(result);
  });
  Handlebars.registerHelper('purchaseDate', function () {
    var result



    let date = new Date();
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = date.getFullYear();
    result = mm + "/" + dd + "/" + yyyy;

    return new Handlebars.SafeString(result);
  });
  Handlebars.registerHelper('formatDate', function (date) {
    var result
    console.log(date);
    typeof (date);

    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = date.getFullYear();
    result = mm + "/" + dd + "/" + yyyy;

    return new Handlebars.SafeString(result);
  });

  window.addEventListener('popstate', (event) => route(), false);
  $.when(loadPartial('/partials/navbar.hbs', 'navbar'),
    loadPartial('/partials/header.hbs', 'header'),
    loadPartial('/partials/footer.hbs', 'footer'),
    loadPartial('/partials/messages.hbs', 'messages')
  ).always(function () {
    route();
  });
});