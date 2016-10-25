var express = require('express');
var db = require('../models');
var passport = require('../config/ppConfig');
var bodyParser = require("body-parser");
var router = express.Router();
var graph = require('fbgraph');
var request = require('request');
var fs = require("fs");
var helperFunction = require('../controllers/helperFunctions');

var results = null;

router.use(bodyParser.urlencoded({extended: false}));

// graph.setAccessToken(access_token);

//use a mathematical structure called a Markov chain to model the statistical 
//likelihood of a word in a title being followed by some other word in a title.

router.get('/results', function(req, res) {
  var url = "https://graph.facebook.com/v2.8/me/posts?access_token=" + req.user.facebookToken;
  var fileContents = fs.readFileSync('data.json');
  var data = JSON.parse(fileContents);
  

  request(url, function(error, response, body){
    if (!error && response.statusCode == 200) {
      var dataObj = JSON.parse(body);
      //    console.log(dataObj);
  	  // res.render("results", {results: dataObj.data});

  	  var postArray = dataObj.data.filter(function(post){
  	  	return post.message;
  	  });

      results = new helperFunction.Map([]);

    	  for(var i = 0; i < postArray.length; i++){
    	  	var post = postArray[i].message;
          helperFunction.processMessage(results,post);

    	  }

      function randomize(array) {
        var j = Math.floor(array.length * Math.random());
        return array[j];
      }

      function generateSentence(results){
        var startWord = randomize(results.starts);
        var availableWords = results.getValueByKey(startWord);
        var sentence = startWord + " ";

        var endedSentence = false;
        var wordCount = 0;

        console.log(startWord);
        console.log(availableWords);
        //console.log(sentence);


        while(!endedSentence && wordCount < 50){
          //console.log(availableWords);
          //console.log(sentence);


          var nextWord = results.pickWord(availableWords);
          if(nextWord[nextWord.length - 1] === "$"){
            endedSentence = true;
            nextWord = nextWord.substring(0,nextWord.length -1);
            sentence += nextWord;
          }
          else{
            availableWords = results.getValueByKey(nextWord);
            sentence += nextWord + " ";
          }
          wordCount++;
        }

        console.log("end");
        console.log(sentence);
        return sentence;
      } 
      var result = generateSentence(results);
      res.render("getInfo", {result:result});
    }
    else {
      console.log("error = " + error);
      console.log(response.statusCode);
    }
  });
});

 
module.exports = router;
