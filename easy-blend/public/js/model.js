Model = {} 
Model.products = [{ 
  _id: 1, 
  title: 'Super Mario 3D World and Bowser\'s Fury', 
  description: '…', 
  url: 'images/blend_pieces.jpg', 
  price: 36.3, 
  tax: 9.66 
}, { 
  _id: 2, 
  title: 'Splatoon 2', 
  description: '…', 
  url: 'img/2.jpg', 
  price: 36.33, 
  tax: 9.66 
},
{ 
  _id: 3, 
  title: 'Splatoon 3', 
  description: '…', 
  url: 'img/2.jpg', 
  price: 36.33, 
  tax: 9.66 
}
]; 
Model.user = null; 
Model.users = [{ 
  _id: 1, 
  email: 'paco@mermela.org', 
  password: 'lamparita22', 
  name: 'Paco', 
  surname: 'Mermela', 
  birthdate: new Date(1990, 1, 1), 
  address: '123 Main St, 12345 New York, USA', 
  cartItems: [], 
  orders: [] 
  
}];

Model.signin = function (email, password) {
  
  Model.user = null;
  for (var i = 0; i < Model.users.length; i++) {
  if (Model.users[i].email == email && Model.users[i].password == password)
  Model.user = Model.users[i];
  }
  }


Model.signout = function(){

  Model.user = null;
  

}