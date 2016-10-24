//this is a word class
//the goal of this is to construct a key value object
function Word(unit, array){
  this.unit = unit;
  //this is what will follow the key.
  this.following = array;
  // this.followContains = function(addUnit){
  //   for(var i = 0; i < this.following.length; i++){
  //     if(addUnit === this.following[i].unit){
  //       return true;
  //     }
  //   }
  //   return false;
  this.followingIncrementOrAdd = function(addUnit){
    for(var i = 0; i < this.following.length; i++){
      if(addUnit === this.following[i].unit){
        this.following[i].count += 1;
        return;
      }
    }

    this.following.push({ unit: addUnit, count: 1});
  }
}

//this is the hash map constructor
function Map(words){
  this.words = words;
  this.starts = [];
  this.ends = [];

  this.getKeys = function(){
    var results = [];
    for(var i = 0; i < this.words.length; i++){
      results.push(this.words[i].unit);
    }
    return results;
  }
  this.getValueByKey = function(targetUnit){
    for(var i = 0; i < this.words.length; i++){
      if(targetUnit === this.words[i].unit){
        return this.words[i].following;
      }
    }
  }
  this.keyExists = function(targetUnit){
    var keys = this.getKeys();
    if(keys.indexOf(targetUnit)=== -1){
      return false;
    }
    return true;
  }
  this.addValueToKey = function(targetUnit, addUnit){
    for(var i = 0; i < this.words.length; i++){
      if(targetUnit === this.words[i].unit){
        this.words[i].followingIncrementOrAdd(addUnit);
        return;
      }
    }
    this.words.push(new Word(targetUnit, [{unit: addUnit, count: 1}]));
  }
  // this.addStart = function(unit){
  //   this.starts.push(unit);
  // }
  this.addEnding = function(unit){
    this.ends.push(unit);
  }
}

Map.prototype.addStart = function(unit){
  this.starts.push(unit);
}


function processMessage(resultsMap, post){
  var message = post.split(' ');

  if(message.length > 0){
    resultsMap.addStart(message[0]);
  }
  for(var i = 0; i < message.length; i++){
    if(i + 2 >= message.length){
      resultsMap.addEnding(message[i], message[i + 1]);
      return;
    }
    resultsMap.addValueToKey(message[i], message[i + 1]);
  }
  return resultsMap; 
}


module.exports = {
  Map:Map,
  Word:Word,
  processMessage:processMessage
}

