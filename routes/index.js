var express = require('express');
var router = express.Router();
var usermodel=require('./users')
const postmodel=require("./post")
var localstrategy=require('passport-local');
const passport = require('passport');
const upload=require("./multer")
passport.use(new localstrategy({usernameField:'email'},usermodel.authenticate()))
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get("/newlogin",(req,res)=>{
  var error=req.flash("error");
  res.render("loginpage",{error})
})

router.post("/register",(req,res)=>{
  console.log(req.body); // Debug: Log the request body
  const userdata1=new usermodel({
    firstname:req.body.firstname,
    lastname: req.body.lastname,
    phonenumber:req.body.phoneno,
    email:req.body.email,
    date: req.body.dob,
    gender:req.body.gender
  })
  
  usermodel.register(userdata1,req.body.password,(err,registeruser)=>{
    if(err){
      console.log(err);
      return res.redirect("/register")
    }
    passport.authenticate("local")(req,res,()=>{
      res.redirect("/newlogin")
    })
  })
})


router.get("/profile",isLoggedIn,async(req,res)=>{
  let user=await usermodel.findOne({
    // username(jisseh login karte ho):req.session.passport.model_ka_naam;
    email:req.session.passport.user
  }).populate('posts')
  console.log(user);
  res.render('profile',{user})
})

router.post("/login",passport.authenticate('local',{
  successRedirect:"/profile",
  failureRedirect:"/newlogin",
  failureFlash:true
}),()=>{})


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/newlogin")
}

router.get("/logout",(req,res)=>{
  req.logout((err)=>{
    if(err){
      return next(err)
    }
    res.redirect("/newlogin")
  })
})

router.post("/uploads",isLoggedIn,upload.single("file"),async(req,res)=>{
  if(!req.file){
    return res.status(404).send("file not found");
  }

  const userdata=await usermodel.findOne({email:req.session.passport.user});
  const postdata=await postmodel.create({
    postText: req.body.caption,
      users:userdata._id,
      image:req.file.filename,   
  })
  userdata.posts.push(postdata._id);
  await userdata.save();
  res.redirect("/profile")
})

router.post("/dp",isLoggedIn,upload.single("dp"),async(req,res)=>{
  const profileiamge=await usermodel.findOne({email:req.session.passport.user});
  profileiamge.dp=req.file.filename;
  await profileiamge.save();
  res.redirect("/profile")
})


module.exports = router;
