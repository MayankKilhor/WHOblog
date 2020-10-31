var express			= 	require("express"),
	app 			= 	express(),
	methodOverride	=	require("method-override"),
	expressSanitizer=	require("express-sanitizer"),
	bodyParser		= 	require("body-parser"),
 	path       	 	=   require("path");
const mongoose 		= require('mongoose');

mongoose.connect('mongodb://localhost/blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

//APP CONFIG
app.set("view engine","ejs");

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//Database CONFIG
var blogschema= new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{ type: Date, default: Date.now}
});

var Blog=mongoose.model("Blog",blogschema);

app.get("/",function(req,res){
	res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs",function(req,res){
	Blog.find({},function(err, blogs){
		if(err){
			console.log(err);
		}else{
			res.render("index",{blogs: blogs});
		}
	});
	
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
	res.render("new");	
})

//CREATE ROUTE
app.post("/blogs",function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render("new");
		}else{
			res.redirect("/blogs");
		}
	})
});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
	
	Blog.findById(req.params.id,function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog: foundBlog});
		}
	})
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit",{blog: foundBlog});
		}
	})
	
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
       if(err){
           console.log(err);
       } else {
         var showUrl = "/blogs/" + blog._id;
         res.redirect(showUrl);
       }
   });
});


//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndDelete(req.params.id, req.body.blog, function(err, blog){
       if(err){
           console.log(err);
       } else {
         var showUrl = "/blogs";
         res.redirect(showUrl);
       }
   });
})

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
