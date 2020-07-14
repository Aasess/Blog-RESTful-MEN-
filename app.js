//----------packages-------------------
var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    app = express();
//-------------App config----------------
//use body parser 
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(expressSanitizer());
app.use(methodOverride("_method"))

//use static files
app.use(express.static("public"));
app.set("view engine","ejs");

//---------------Mongoose config--------------------
//connect to db
mongoose.connect("mongodb://localhost/blog_db",{ useNewUrlParser: true,  useUnifiedTopology: true });

//schema 
var blogSchema = new mongoose.Schema({
    title:String,
    content:String,
    image:String,
    datecreated:{type: Date, default:Date.now}
})

//make collection(table)
var Blog = mongoose.model("Blog",blogSchema);

//--------------Routes----------------------

//redirecting root to index
app.get("/",function(req,res){
    res.redirect("/blogs");
})
//first route index
app.get("/blogs",function(req,res){
    Blog.find({}).exec(function(err,blogs){
        if(!err){
            res.render("home.ejs",{blogs:blogs});
        }
    });
});
//NewBlog new route
app.get("/blogs/new",function(req,res){
    res.render("newBlog.ejs");
});

//post create route
app.post("/blogs",function(req,res){
  Blog.create(req.body,(err,newblog)=>{
    if(!err){
        console.log("entry to database");
        res.redirect("/blogs")
    }
  });
});

//show detail routes
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(!err){
            res.render("detail.ejs",{specificblog:foundBlog});
        }
    })
})

//edit routes
app.get("/blogs/:id/edit",function(req,res){
   Blog.findById(req.params.id,(err,foundBlog) =>{
    if(err){
        res.redirect("/blogs");
    }else{
        res.render("edit.ejs",{blog:foundBlog});
    }
   });
});

//upadte routes
app.put("/blogs/:id", (req,res)=> {
   Blog.findByIdAndUpdate(req.params.id,req.body,(err,updateBlog) => {
       if(err){
           res.redirect("/blogs");
       }else{
           res.redirect("/blogs/"+req.params.id);
       }
   });
});

//delete page routes
app.get("/blogs/:id/delete",(req,res) => {
    Blog.findById(req.params.id,(err,foundBlog) => {
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("delete.ejs",{blog:foundBlog});
        }
    });
});

//delete routes
app.delete("/blogs/:id",(req,res) => {
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(!err){
            res.redirect("/blogs");
        }
    });
});

//handling other routes
app.get("*",function(req,res){
    res.send("<strong>ERROR 404!!</strong>Page not found. ")
})


//--------------listen to event--------------------------
app.listen(9000,function(){
    console.log("Server Started!!");
});

