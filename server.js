'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');
var dns = require('dns');

var URLmapping = Map();

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// url shortener endpoint
app.post("/api/shorturl/new", (req, res) => {
  var { url } = req.body;
  try {
    // check if the provided url is valid
    dns.lookup(url, (error) => {
      if (error) throw error;

      var n = Math.random();
      URLmapping.set(n, url);
  
      res.json({ "original_url" : url, "short_url" : n });
    });
  } catch (error) {
    res.json({ "error" : "invalid URL" });
  }
});

// access shorted url
app.get("/api/shorturl/:n", (req, res) => {
  var { n } = req.params;
  var url = URLmapping.get(n);

  // Redirect
  res.writeHead(302, {
    'Location' : url
  });
  res.end();
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});
