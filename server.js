"use strict";

var express = require("express");
var bodyparser = require("body-parser");
var cors = require("cors");
var dns = require("dns");

var URLmapping = new Map();

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyparser.json());

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// url shortener endpoint
app.post("/api/shorturl/new", (req, res) => {
  var { url } = req.body;
  var originalUrl = url;

  // remove trailing '/' from the end of the url
  url = url.replace(/\/$/, "");
  // remove the protocol from the beginning of the url
  url = url.replace(/^https:\/\//, "");
  url = url.replace(/^http:\/\//, "");

  // check if the provided url is valid
  dns.lookup(url, (error) => {
    if (error) {
      return res.json({ error: "invalid URL" });
    }

    var n = Math.floor(Math.random() * 100);
    URLmapping.set(n, originalUrl);

    return res.json({ original_url: originalUrl, short_url: n });
  });
});

// access shorted url
app.get("/api/shorturl/:n", (req, res) => {
  var { n } = req.params;
  var url = URLmapping.get(parseInt(n));

  // Redirect
  return res.redirect(url);
});

app.listen(port, function () {
  console.log("Node.js listening ...");
});
