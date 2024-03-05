var express = require('express');
var app = express();

// var things = require('./things.js');
app.get('/:id', function(req, res){
    res.send('The id you specified is ' + req.params.id);
 });
//both index.js and things.js should be in same directory
// app.use('/things', things);

app.listen(3000);