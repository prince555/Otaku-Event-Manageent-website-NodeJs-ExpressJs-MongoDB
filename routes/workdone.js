var express = require('express');
var router = express.Router();
var userModule=require('../modules/user');
var passCatModel = require('../modules/password_category');
var passModel = require('../modules/add_password');
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

router.get('/', checkLoginUser,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    getPassCat.exec(function(err,data){
  if(err) throw err;
  res.render('workdone', { title: 'Otaku',loginUser: loginUser,records: data,success:''});
  
    });
    });
  
    router.post('/', checkLoginUser,function(req, res, next) {
      var loginUser=localStorage.getItem('loginUser');
  var pass_cat= req.body.pass_cat;
  var project_name= req.body.project_name;
  var pass_details= req.body.pass_details;
  var password_details= new passModel({
    password_category:pass_cat,
    project_name:project_name,
    password_detail:pass_details
  });
      
    password_details.save(function(err,doc){
      getPassCat.exec(function(err,data){
        if(err) throw err;
      res.render('workdone', { title: 'Otaku',loginUser: loginUser,records: data,success:"workdone Details submitted Successfully"});
    
    });
    
      });
      });
  
  module.exports = router;