//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

//create database
mongoose.connect('mongodb://localhost:27017/posts', {useNewUrlParser: true, useUnifiedTopology: true});


//post model
const Post = mongoose.model("Post", {
  postTitle: String,
  postContent: String
});


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//root route
app.get("/", function(req, res) {

  Post.find({}, function(err, posts){
    if(posts.length === 0){
      const homeStartingContent = new Post({
        postTitle: "Quem sou Eu",
        postContent: "É um fato conhecido de todos que um leitor se distrai Existem muitas variações disponíveis de passagens de Lorem Ipsum, mas a maioria sofreu algum tipo de alteração, seja por inserção de passagens com humor, ou palavras aleatórias que não parecem nem um pouco convincentes. Se você pretende usar uma passagem de Lorem Ipsum, precisa ter certeza de que não há algo embaraçoso escrito escondido no meio do texto."
      });
      homeStartingContent.save();
    }else {
      res.render("home", {
        firstHomeContent: "Olá!",
        postsArray: posts
      });
    }
  });

  
});

//about route
app.get("/about", function(req, res){
  res.render("about", {aboutParagraph: aboutContent});
});

//contact route
app.get("/contact", function(req, res){
  res.render("contact", {contactParagraph: contactContent});
});

//compose route
app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {

  const post = new Post({
    postTitle: req.body.postTitle,
    postContent: req.body.postContent
  });

  post.save(function(err){

    if (!err){

      res.redirect("/");

    }

  });

  

});

//post route
app.get("/posts/:postId", function(req,res){
  const requestedId = req.params.postId;   
  
  Post.findOne({_id: requestedId}, function(err, post){
    if(!err){
      res.render("post", {
        title : post.postTitle,
        body : post.postContent
      });
    }
  });

  // Post.find(function(err, posts){

  //   if(err){
  //     console.log(err);
  //   } else{
  //     posts.forEach(function(post){

  //       const storedId = post._id;        
    
  //       if(requestedId === storedId) {
  //         res.render("post", {
  //           title : post.postTitle,
  //           body : post.postContent
  //         });
  //       }
  //     }); 
  //   }

    
  // });

  
  
});








app.listen(3000, function() {
  console.log("Server started on port 3000");
});
