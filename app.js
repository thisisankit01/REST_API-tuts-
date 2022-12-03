import express from 'express'
import ejs from 'ejs'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

const app = express();
const PORT = 3000;

//express uses
app.use(express.static('public'))//To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
app.set('view engine', 'ejs');//A template engine enables you to use static template files in your application. At runtime, the template engine replaces variables in a template file with actual values, and transforms the template into an HTML file sent to the client. This approach makes it easier to design an HTML page.
                              //View engines allow us to render web pages using template files.
app.use(bodyParser.urlencoded({extented:true}));

//database
mongoose.connect("mongodb+srv://ankitpandey:ankitpandey@cluster0.kvppdtr.mongodb.net/wikiDB?retryWrites=true&w=majority",(err)=>{
if(err){
  console.log(err);
}
else {
console.log("connect to db");
}
});

//database schema
const articleSchema = {
  title : String,
  content : String
};
const Article = mongoose.model("Article", articleSchema);

////////////////////////////////////request targeting for all elements/////////////////////////////////////////////

//routes
app.route("/articles")

//get req all
.get(function(req,res){
  Article.find(function(err, foundArticles){
    if(!err){
    res.send(foundArticles)
    }
    else{
      console.log(err);
    }
  })
})

//post req all
.post(function(req,res){
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  })

  newArticle.save(function(err){
    if(!err){
      res.send("sucessfully added to db")
    }
    else{
      console.log(err);
    }
  })
})

//delete req all
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("successfully deleted all the articles")
    }
    else{
      res.send(err);
    }
  })
  });

  ////////////////////////////////////request targeting for specific elements/////////////////////////////////////////////

app.route("/articles/:articleTitle") //The app.route method allows you to define multiple HTTP methods for a given route path without having to repeat the path for each method

.get(function(req,res){
  Article.findOne({title: req.params.articleTitle}, function(err,articleTitle){
    if(!err){
      res.send(articleTitle)
    }
    else{
      res.send("no article found")
    };
  });
})

.put(function (req,res){
   Article.updateOne(
    {title:req.params.articleTitle},
    {title:req.body.title , content:req.body.content},
    {overwrite: false},
    function(err){
     if(!err){
      res.send(`successfully updated `)
     }
     else{
      console.log(err);
     }
    }
    );
})

.patch(function (req,res){
  Article.updateOne(
{title: req.params.articleTitle},
{$set: req.body},
function(err) {
if(!err){
  res.send("successfully updated")
}
else{
  res.send(err);
}
}
);

})

.delete(function (req,res){
  Article.deleteOne(
{title: req.params.articleTitle},
function(err) {
if(!err){
  res.send("deleted successfully")
}
else{
  res.send(err);
}
}
);

});

app.listen(PORT,()=>{
console.log(`listening on ${PORT}`);
});

//A template engine enables you to use static template files in your application. 
//At runtime, the template engine replaces variables in a template file with actual values, 
//and transforms the template into an HTML file sent to the client. 
//This approach makes it easier to design an HTML page.