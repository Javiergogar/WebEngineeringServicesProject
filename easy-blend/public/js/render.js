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
    else if (matches = path.match(/^\/([^\/]*)\/?$/)) 
      render('/templates/' + matches[1] + '.hbs', '#content', Model); 
    else 
      console.error('ROUTING ', path); 
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
      
      window.addEventListener('popstate', (event) => route(), false); 
    $.when(loadPartial('/partials/navbar.hbs', 'navbar'), 
     loadPartial('/partials/header.hbs', 'header'), 
     loadPartial('/partials/footer.hbs', 'footer') 
).always(function () { 
  route(); 
}); 
  });