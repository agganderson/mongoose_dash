var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongoose_dashboard');
var MDashboardSchema = new mongoose.Schema({
	name: String,
	age: Number
});
MDashboardSchema.path('name').required(true, 'Name cannot be blank');
MDashboardSchema.path('age').required(true, 'Age cannot be blank');

mongoose.model('MDash', MDashboardSchema);
var MDash = mongoose.model('MDash');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


app.get('/', function(req, res){
	MDash.find({}, function(err, owl){
		if(err){
			console.log('Idk why but you didn"t get that owl info');
		}
		else{
			console.log('Good job, you got that info');
			res.render('index', {owl:owl});
		}
	});
});

app.get('/new', function(req, res){
	res.render('new');
});

app.post('/new', function(req, res){
	console.log('POST DATA', req.body);
	var owl = new MDash({name:req.body.name, age:req.body.age});
	owl.save(function(err){
		if(err){
			console.log('Check your code, something fucked up');
			res.render('new', {title: 'you have errors', errors:owl.errors});
		}
		else{
			console.log('Got info!');
			res.redirect('/');
		}
	});
});

app.get('/show/:id', function(req, res){
	MDash.findOne({_id:req.params.id}, function(err, owl){
		res.render('owl', {owl:owl});
	});
});

app.get('/edit/:id', function(req, res){
	MDash.findOne({_id:req.params.id}, function(err, owl){
		res.render('edit', {owl:owl});
	});
});

app.post('/edit/:id', function(req, res){
	MDash.update({_id:req.params.id}, {name:req.body.name, age:req.body.age}, function(err, owl){
		if(err){
			console.log('NOPE');
			//validations for updating don't work 
			//fix this later!
			//res.render('edit/:id', {title: 'you have errors', errors:owl.errors});
		}
		else{
			console.log('Congrats');
			res.redirect('/');
		}
	});
});

app.post('/delete/:id', function(req, res){
	MDash.remove({_id:req.params.id}, function(err, owl){
		if(err){
			console.log("Didn't delete, check your code");
		}
		else{
			console.log("Deleted that owl :(");
			res.redirect('/');
		}
	})
})


var server = app.listen(8001, function(){
	console.log('Listening to Mongoose Dashboard on port 8001');
});