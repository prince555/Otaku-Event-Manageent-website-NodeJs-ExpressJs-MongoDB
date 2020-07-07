var express = require('express');
var router = express.Router();
var userModule=require('../modules/user');
var passCatModel = require('../modules/password_category');
var passModel = require('../modules/add_password');
var annoModel = require('../modules/announcements');
var bcrypt =require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

var getanno= annoModel.find({}).sort({"_id": -1});
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
  passModel.countDocuments({}).exec((err,count)=>{
    passCatModel.countDocuments({}).exec((err,countasscat)=>{    
      annoModel.countDocuments({}).exec((err,countanno)=>{
  res.render('home', { title: 'Otaku', msg:'',totalPassword:count, totalPassCat:countasscat, totalannounce: countanno });
      });
  });
});
});

router.get('/events', function(req, res, next) {
  res.render('events', { title: 'Otaku', msg:'' }); 
});

router.get('/post_events', function(req, res, next) {
  res.render('postevents', { title: 'Otaku', msg:'' }); 
});

router.get('/services', function(req, res, next) {
  res.render('services', { title: 'Otaku', msg:'' }); 
});

router.get('/gallery', function(req, res, next) {
  res.render('gallery', { title: 'Otaku', msg:'' }); 
});

router.get('/team', function(req, res, next) {
  res.render('team', { title: 'Otaku', msg:'' }); 
});

router.get('/sponsors', function(req, res, next) {
  res.render('sponsors', { title: 'Otaku', msg:'' }); 
});

router.get('/contactus', function(req, res, next) {
  res.render('contactus', { title: 'Otaku', msg:'' }); 
});

router.get('/announce', function(req, res, next) {
  getanno.exec(function(err,data){
    if(err) throw err;
  res.render('announce', { title: 'Otaku',records:data});
});
});

router.get('/', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  getPassCat.exec(function(err,data){
    if(err) throw err;
  res.render('password_category', { title: 'Password Management System',loginUser: loginUser,records:data});
});
});

router.get('/announcement', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  res.render('announcement', { title: 'Otaku', msg:'',loginUser:loginUser,errors:'',success:'' }); 
});

router.post('/announcement', [ check('annocat','Enter Password Category Name').isLength({ min: 1 })],function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  const errors = validationResult(req);
  if(!errors.isEmpty()){
   
    res.render('announcement', { title: 'Otaku',loginUser: loginUser, errors:errors.mapped(),success:'' });

  }else{
     var anno_Name =req.body.annocat;
     var annoDetails =new annoModel({
      announce_cat: anno_Name
     });

     annoDetails.save(function(err,doc){
       if(err) throw err;
       res.render('announcement', { title: 'Otaku',loginUser: loginUser, errors:'', success:'Announcement inserted successfully' });

     })
    
  }
  });

  router.get('/userdashboard', checkLoginUser,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
      annoModel.countDocuments({}).exec((err,countanno)=>{   
    res.render('userdashboard', { title: 'Otaku', loginUser:loginUser,msg:'',totalannounce: countanno });
    });
  });

// router.get('/signin', function(req, res, next) {
//   var loginUser=localStorage.getItem('loginUser');
//   if(loginUser){
//     res.redirect('./userdashboard');
//   }else{
//   res.render('index', { title: 'Otaku', msg:'' });
//   }
// });

router.get('/signin', function(req, res, next) {
  res.render('index', { title: 'Otaku', msg:'' });

});

router.post('/signin', function(req, res, next) {
  var username=req.body.uname;
  var password=req.body.password;
  var checkUser=userModule.findOne({username:username});
  checkUser.exec((err, data)=>{
   if(data==null){
    res.render('index', { title: 'Otaku', msg:"Invalid Username and Password." });

   }else{
if(err) throw err;
var getUserID=data._id;
var getPassword=data.password;
if(bcrypt.compareSync(password,getPassword)){
  var token = jwt.sign({ userID: getUserID }, 'loginToken');
  localStorage.setItem('userToken', token);
  localStorage.setItem('loginUser', username);
  res.redirect('/userdashboard');
}else{
  res.render('index', { title: 'Otaku', msg:"Invalid Username and Password." });

}
   }
  });
 
});


router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Otaku', msg:'' });
  
});
router.post('/signup',checkUsername,checkEmail,function(req, res, next) {
        var username=req.body.uname;
        var email=req.body.email;
        var password=req.body.password;
        var confpassword=req.body.confpassword;
  if(password !=confpassword){
    res.render('signup', { title: 'Otaku', msg:'Password not matched!' });
   
  }else{
    password =bcrypt.hashSync(req.body.password,10);
        var userDetails=new userModule({
          username:username,
          email:email,
          password:password
        });
     userDetails.save((err,doc)=>{
        if(err) throw err;
        res.render('signup', { title: 'Otaku', msg:'User Registerd Successfully' });
     })  ;
    } 

  
});

router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});
module.exports = router;