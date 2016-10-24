'use strict';
module.exports = function(sequelize, DataTypes) {
  var word = sequelize.define('word', {
    unit: DataTypes.STRING,
    startingPoint: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return word;
};