import request from './util/utils/request.js';
import baseUtil from './util/utils/baseUtil.js';

var params = baseUtil.getUrlParam('useruri');
var useruri = params || `${location.origin}/index`;
document.getElementById('name').focus();
var sureBtn = document.getElementById('sureBtn');
var nameInput = document.getElementById('name');
var passwordInput = document.getElementById('password');
sureBtn.addEventListener('click', function(){
  request.alert = function(mes){
    document.getElementById('error').innerHTML = mes;
  };
  request.post({
    url: '/api/login/doLogin',
    returnAll: true,
    data: {
      name: nameInput.value,
      password: passwordInput.value,
      useruri: useruri
    },
    success: function(){
    },
    error: function(){
    }
  });
});
passwordInput.addEventListener('keyup', function(e){
  if(e.key == 'Enter'){
    sureBtn.click();
  }
});
nameInput.addEventListener('keyup', function(e){
  if(e.key == 'Enter'){
    sureBtn.click();
  }
});
