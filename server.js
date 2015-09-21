var express = require('express'), 
    path = require('path');

var app = express();

app.engine('html', require('ejs').renderFile);

app.set('views', __dirname + '/dev');
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'dev')));

app.get('*', function(req, res){
   res.render('index');
});

app.listen(3000); 
console.log("server running on port 3000");