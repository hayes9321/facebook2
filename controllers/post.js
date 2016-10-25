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

//This get route will grant access to facebook and supply post information
// to manipulate and generate a random post based on the markov chain algorithm.
router.get('/results', function(req, res) {
  var url = "https://graph.facebook.com/v2.8/me/posts?limit=1000&access_token=" + req.user.facebookToken;
  var fileContents = fs.readFileSync('data.json');
  var data = JSON.parse(fileContents);
  
  //Make a request to facebook.
  request(url, function(error, response, body){
    if (!error && response.statusCode == 200) {
      var dataObj = JSON.parse(body);

      //Store post.message information from facebook.
  	  var postArray = dataObj.data.filter(function(post){
  	  	return post.message;
  	  });

      //Create a new map object from data obtained from facebook.
      results = new helperFunction.Map([]);

        //Send the data to the process message function to create 
        //key value pairs for the new object.
    	  for(var i = 0; i < postArray.length; i++){
    	  	var post = postArray[i].message;
          helperFunction.processMessage(results,post);
    	  }

      //Randomly select an element from an array
      function randomize(array) {
        var j = Math.floor(array.length * Math.random());
        return array[j];
      }

      //Generate a random sentence from the map object.
      function generateSentence(results){
        var startWord = randomize(results.starts);
        var availableWords = results.getValueByKey(startWord);
        var sentence = startWord + " ";
        var endedSentence = false;
        var wordCount = 0;

        //This while loop actually generates the sentence from the hashmap 
        //object
        while(!endedSentence && wordCount < 50){

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

        return sentence;
      } 
      //store the sentence in a varible so that it can be sent to the
      //render 
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
