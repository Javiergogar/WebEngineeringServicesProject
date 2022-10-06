Model = {} 
Model.products = [{ 
  _id: 1, 
  title: 'Super Mario 3D World and Bowser\'s Fury', 
  description: '…', 
  url: 'img/1.jpg', 
  price: 36.3, 
  tax: 9.66 
}, { 
  _id: 2, 
  title: 'Splatoon 2', 
  description: '…', 
  url: 'img/2.jpg', 
  price: 36.33, 
  tax: 9.66 
}]; 
Model.user = null; 
Model.users = [{ 
  _id: 1, 
  email: 'johndoe@example.com', 
  password: '1234', 
  name: 'John', 
  surname: 'Doe', 
  birthdate: new Date(1990, 1, 1), 
  address: '123 Main St, 12345 New York, USA', 
  cartItems: [], 
  orders: [] 
}];