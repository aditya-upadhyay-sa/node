const express = require("express")
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser")

const Userdata = require('./models/usermodel')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt-nodejs')
const jwt=require('jsonwebtoken')
const ExpenseData=require('./models/expensemodel')
const cors = require('cors')
 
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/myproject");

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))
function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }
  

app.route('/api/getusers').get(verifyToken,(req, res) => {


    

  
    Userdata.find({},function(err,data){

        if(err){
            console.log("error is there!")
        }else{
            
            res.json(data)
            // res.send(data);
        }
    })


})

app.post('/api/addusers/', (req, res) => {



    var hash = bcrypt.hashSync(req.body.password);


    var newuser = new Userdata({ firstName: req.body.firstName, lastName: req.body.lastName, username: req.body.email, password: hash });




                                           
    Userdata.findOne({ username: newuser.username }, function (err, data) {
        if (err) {
            console.log(err)
        }
        if (data) {

            res.json("User is already Registered!");



        } else {
            Userdata.create(newuser,
                function (err, usersdata) {
                    if (err) {
                        console.log("There is an error!");
                    }else{
                        let payload={subject : usersdata._id,fname:usersdata.firstName}
                        let token=jwt.sign(payload,'secretKey')
                        res.status(200).send({token,name:usersdata.firstName});
                    }

                }
            )

        }


    })

    // res.send(req.body);
    // console.log("response")
    // res.send("inside node code")

})

app.post("/api/afterlogin/", (req, res) => {


    
    var email1 = req.body.email;
    var password1 = req.body.password;
    console.log(password1)
    var value = false;



    Userdata.findOne({ username: email1 }).exec(function (err, data) {
        if (err) {
            console.log(err);
        } if (!data) {
            
            console.log("Sorry! email not found!")
            res.status(400).json("Sorry! email not found")
        }
        else {
            // var pass=bcrypt.hashSync('aditya123')
            // checking for password correction
            value = bcrypt.compareSync(req.body.password,data.password);
   
            if (value) {

              
                let payload={subject:data._id,fname:data.firstName}
                 let token=jwt.sign(payload,'secretKey')
               
                res.status(200).json({token,name:req.body.email});
            }else{
                res.status(401).json("Invalid Password!")
            }



        }

    });
});


app.post("/api/expenseadd",(req,res)=>{

    let expensedata={
            ExpenseName:req.body.name,
            ExpenseAmount:req.body.amount,
            friendlist:req.body.friendlist,
            perpersonamount:req.body.perpersonamount,
            Date:req.body.date
    }
    console.log(expensedata);
    ExpenseData.create(expensedata,function(err,data){

            if(err){
                console.log(err)
            }else{
                res.json(data);
                console.log(data);
            }
                

    })
    
    


})







// function isLoggedin(req,res,next){

//     if(req.isAuthenticated()){
//         return next();
//     }
//     console.log("inside login function ")
// }

app.listen(8080, function () {

    console.log("server Started");
})