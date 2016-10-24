'use strict';
module.exports = function(sequelize, DataTypes) {
  var map = sequelize.define('map', {
    wordId: DataTypes.STRING,
    followingUnit: DataTypes.STRING,
    weight: DataTypes.DECIMAL
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return map;
};