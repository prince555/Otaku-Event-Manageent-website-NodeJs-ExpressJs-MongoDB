var express = require('express');
var router = express.Router();
var userModule=require('../modules/user');
var passCatModel = require('../modules/password_category');
var passModel = require('../modules/add_password');
var annoModel = require('../modules/announcements');
var bcrypt =require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

var getPassCat= passCatModel.find({});
var getAllPass= passModel.find({});
/* GET home page. */

function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkUsername(req,res,next){
  var uname=req.body.uname;
  var checkexitemail=userModule.findOne({username:uname});
  checkexitemail.exec((err,data)=>{
 if(err) throw err;
 if(data){
  
return res.render('signup', { title: 'Otaku', msg:'Username Already Exit' });

 }
 next();
  });
}

function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexitemail=userModule.findOne({email:email});
  checkexitemail.exec((err,data)=>{
 if(err) throw err;
 if(data){
  
return res.render('signup', { title: 'Otaku', msg:'Email Already Exit' });

 }
 next();
  });
}

router.get('/', function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    passModel.countDocuments({}).exec((err,count)=>{
      passCatModel.countDocuments({}).exec((err,countasscat)=>{    
        annoModel.countDocuments({}).exec((err,countanno)=>{
    res.render('dashboard', { title: 'Otaku', loginUser:loginUser,msg:'',totalPassword:count, totalPassCat:countasscat, totalannounce: countanno });
        });
    });
  });
  });

  module.exports = router;