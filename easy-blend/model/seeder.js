var mongoose = require('mongoose');
mongoose.Promise = global.Promise;


//Schemas
var User = require('./user');
var Product = require('./product');
var Order = require('./order');

var uri = 'mongodb://127.0.0.1/easy-blend'; //hasta game-shop es el server, lo de despues es el nombre de la bbdd
var db = mongoose.connection;

db.on('connecting', function () {
    console.log('Connecting to', uri);
});
db.on('connected', function () {
    console.log('Connected to', uri);
});
db.on('disconnecting', function () {
    console.log('Disconnecting from', uri);
});
db.on('disconnected', function () {
    console.log('Disconnected from', uri);
});
db.on('error', function (err) {
    console.error('Error:', err.message);
});

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(function () {

    var user = new User({
        email: 'test@gmail.com', password: 'test', name: 'Test', surname: 'test', birth:
            Date.UTC(1990, 0, 1), address: 'calle13',
        cartItems: []
    });

    return User.deleteMany()
        .then(function () { return User.deleteMany(); })
        .then(function () { return Order.deleteMany(); })
        .then(function () { return user.save(); })
        .then(function () { return Product.deleteMany(); })
        .then(function () { return Product.insertMany([{
            title: 'Trio blender',
            description: 'This is a pack to save some money',
            url: 'images/trio_blend.jpg',
            price: 180,
            tax: 9.66
        },
            {
            title: 'Pink blender',
            description: 'This is a nice and happy blender. If you use this you will brighten your days',
            url: 'images/pink_blend.jpg',
            price: 90,
            tax: 9.66
            }, {
            title: 'Pink Pro Blender',
            description: 'This is like Pink Blender but for professionals.',
            url: 'images/pink_pro_blend.jpg',
            price: 100,
            tax: 9.66
        }, {
            title: 'Duo blender',
            description: 'Two for the price of one.',
            url: 'images/duo_blend.png',
            price: 90,
            tax: 9.66
        }, {
            title: 'Duo blender 2',
            description: 'Two for the price of one, second version.',
            url: 'images/duo2_blend.jpg',
            price: 90,
            tax: 9.66
        }, {
            title: 'Pack blender',
            description: 'Big pack blenders.',
            url: 'images/pack_blend.jpg',
            price: 280,
            tax: 9.66
        }, {
            title: 'Blender pieces',
            description: 'Jack El Destripador´s favourite. Easy to assemble and disassemble.',
            url: 'images/blend_pieces.jpg',
            price: 90,
            tax: 9.66
        }, {
            title: 'Green blender',
            description: 'This is a nice and cheap with a beautiful color blender but green. It´s very good for smoothies.',
            url: 'images/green_blend.jpg',
            price: 80,
            tax: 9.66
    
        }]); })
        .then(function (result) {
            console.log(result);
            return mongoose.disconnect();
        });
    //return user.save().then(function (result) {  //Lo introduce en la base de datos  
    //return User.find().then(function (result) {   //Así busca todos
    //return User.findById(mongoose.Types.ObjectId("636bd0acca52534d4536cb9b")).then(function (result) { //Asi por id
    //return User.find({ email: 'johndoe@example.com'}).then(function (result) { //Así por el resto de att, pueden ser varios
    //return User.deleteOne({email:'johndoe@example.com'}).then(function (result) { //Así para borrar
    //return User.findOne({email:'johndoe@example.com'}).then(function (user) { //Ejemplo para encadenar operaciones(otra forma de borrar)
    //     return user.remove();
    //   }).then(function () {
    //     return User.find();
    //   }).then(function (result) { //hasta aqui esta parte de codigo de encadenar

    //     return User.findOne({ email: 'johndoe@example.com' }) //así para modificar atributos
    // }).then(function (user) {
    //     console.log('Pre:', user);
    //     user.password = 'admin2';
    //     return user.save();
    // }).then(function (result) {

    //     console.log(result);
    //     return mongoose.disconnect();
    // });
}).catch(function (err) {
    console.error('Error:', err.message);
});