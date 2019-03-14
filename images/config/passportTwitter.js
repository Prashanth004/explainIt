var passport = require('passport')
var database = require('../app')
const keys = require('./keys');
const TwitterTokenStrategy = require('passport-twitter-token').Strategy;
  
var rn = require('random-number');
var promise = require('bluebird');
var options = {
    promiseLib: promise
};






    