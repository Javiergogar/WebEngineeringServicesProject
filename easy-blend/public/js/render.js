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
    console.log('ROUTING ', path);
    if (matches = path.match(/^\/$/))
      render('/templates/index.hbs', '#content', Model);
    else if (matches = path.match(/^\/order\/id\/([^\/]*)\/?$/)) {
      var order = Model.getOrder(matches[1]);
      if (order)
        render('/templates/order.hbs', '#content', { user: Model.user, order });
      else
        render('/templates/not-found.hbs', '#content', Model);
    }
    else if (matches = path.match(/^\/([^\/]*)\/?$/))
        render('/templates/' + matches[1] + '.hbs', '#content', Model);
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
      Handlebars.registerHelper('totalCartItem', function (qty,price) { 
        var result = qty * price; 
        return new Handlebars.SafeString(result); 
      });
      Handlebars.registerHelper('subtotalCartItem', function () {
        var result=0

        for (var i = 0; i < Model.user.cartItems.length; i++) {
        result= result + (Model.user.cartItems[i].qty * Model.user.cartItems[i].product.price)  
        }
         
        return new Handlebars.SafeString(result); 
      });
      Handlebars.registerHelper('taxesCartItem', function () {
        var result=0
        
        for (var i = 0; i < Model.user.cartItems.length; i++) {
        result= result + (Model.user.cartItems[i].qty * Model.user.cartItems[i].product.tax)  
        }
         
        return new Handlebars.SafeString(result); 
      });
      Handlebars.registerHelper('totalCart', function () { 
        var result=0
        
        for (var i = 0; i < Model.user.cartItems.length; i++) {
        result= result + (Model.user.cartItems[i].qty * Model.user.cartItems[i].product.tax) + (Model.user.cartItems[i].qty * Model.user.cartItems[i].product.price) 
        }
         
        return new Handlebars.SafeString(result); 
      });
      Handlebars.registerHelper('navCartItem', function () { 
        var result=0
        
        for (var i = 0; i < Model.user.cartItems.length; i++) {
        }
        result=i;
         
        return new Handlebars.SafeString(result); 
      });
      Handlebars.registerHelper('purchaseDate', function () { 
        var result
        
        

        let date = new Date();
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = date.getFullYear();
        result= mm+"/"+dd+"/"+yyyy;
         
        return new Handlebars.SafeString(result); 
      });
      Handlebars.registerHelper('formatDate', function (date) { 
        var result
    
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = date.getFullYear();
        result= mm+"/"+dd+"/"+yyyy;
         
        return new Handlebars.SafeString(result); 
      });
      
      window.addEventListener('popstate', (event) => route(), false); 
    $.when(loadPartial('/partials/navbar.hbs', 'navbar'), 
     loadPartial('/partials/header.hbs', 'header'), 
     loadPartial('/partials/footer.hbs', 'footer') 
).always(function () { 
  route(); 
}); 
  });