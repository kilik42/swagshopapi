var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');

var Product = require('./model/product');
var WishList = require('./model/wishList');

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.post('/product', function(request, response){
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    product.save(function(err, savedProduct){
      if (err){
        response.status(500).send({error:"could not save product"});

      }else{
        response.status(200).send(savedProduct);
      }
    });

});



app.get('/wishlist',function (request, response){
    WishList.find({}, function(err, wishLists){
      response.send(wishLists);
    });
});

app.post('/wishlist', function(request, response){
    var wishList = new WishList();
    wishList.title = request.body.title;

     wishList.save(function(err, newWishList){
        if(err){
          response.status(500).send({error: 'could not create wishlist'});
        }else{
          response.send(newWishList);
        }

     });
});
app.get('/product', function(request, response){
    Product.find({}, function(err, products){
      if(err){
        response.status(500).send({error: "could not fetch"});
      }
      else{
        response.send(products);
      }
    });



});

app.put('/wishList/product/add', function(request, response){
  Product.findOne({_id: request.body.productId}, function(err, product){
    if(err){
      response.status(500).send({error: " could not add item to wishlist"});
    }else {
      WishList.update({_id: request.body.wishListId}, {
        $addToSet: {products: product._id}},
        function(err, wishList){
            if(err){
              response.status(500).send({error: " could not add item to wishlist"});
            }else {
              response.send(wishList);
            }

      });
    }
  })
});


//server
app.listen(3000, function(){
  console.log("swag shop api running on port 3000");
});
