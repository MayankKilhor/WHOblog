var express		= 	require("express"),
	app 		= 	express(),
	bodyParser	= 	require("body-parser"),
 	path        =   require("path");
const mongoose = require('mongoose');

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


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
