var util = require('./util.js');
module.exports = [
  {
    "_page" : "http://172.18.39.4:3000/test",
    "stack" : "0SyntaxError: Unexpected token a in JSON at position 0\n    at JSON.parse (<anonymous>)\n    at http://172.18.39.4:3000/test:196:8",
    "message" : "Unexpected token a in JSON at position 0",
    "name" : "SyntaxError",
    "amount" : 17,
    "solve" : false
  },{
    "_page" : "http://172.18.39.4:3000/test",
    "stack" : "1SyntaxError: Unexpected token a in JSON at position 0\n    at JSON.parse (<anonymous>)\n    at http://172.18.39.4:3000/test:196:8",
    "message" : "Unexpected token a in JSON at position 1",
    "name" : "SyntaxError1",
    "amount" : 170,
    "solve" : false
  },{
    "_page" : "http://172.18.39.4:3000/test",
    "stack" : "2SyntaxError: Unexpected token a in JSON at position 0\n    at JSON.parse (<anonymous>)\n    at http://172.18.39.4:3000/test:196:8",
    "message" : "Unexpected token a in JSON at position 2",
    "name" : "SyntaxError2",
    "amount" : 90,
    "solve" : false
  },{
    "_page" : "http://172.18.39.4:3000/test",
    "stack" : "3SyntaxError: Unexpected token a in JSON at position 0\n    at JSON.parse (<anonymous>)\n    at http://172.18.39.4:3000/test:196:8",
    "message" : "Unexpected token a in JSON at position 3",
    "name" : "SyntaxError3",
    "amount" : 40,
    "solve" : true
  }
];
