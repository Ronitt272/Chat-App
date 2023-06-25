//importing all the dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://ronittmehra:ronitt272@cluster0.hngqjk5.mongodb.net/user"); 
const User = require('./models/user'); //importing the model
app.use(express.json()); //access the body
app.use(express.urlencoded({extended: true})); //form does not send url encoded data, so with this, form will send url encoded data 
const { hashSync } = require('bcrypt');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const mongoStore = require('connect-mongo');
const passport = require('passport');
require('./authentication/verification');
const socket = require('socket.io');
const port = 3000;
app.use("/", express.static('public'));
app.use(express.json()); //access the body
app.use(express.urlencoded({extended: true})); //form does not send url encoded data, so with this, form will send url encoded data 
app.use(session({
    resave : false,
    saveUninitialized : true,
    secret : "you can type anything here but it is required",
    cookie : {
        maxAge : 1000 * 60 * 60 * 24
    },
    store : mongoStore.create({
        mongoUrl : "mongodb+srv://ronittmehra:ronitt272@cluster0.hngqjk5.mongodb.net/user",
        collectionName : "sessions"
    })
}));

let user = {};
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");

let server = app.listen(port,(req,res)=>{
    console.log("server started running.");
});

app.get("/", (req,res)=>{
    res.redirect('/login');
})

app.get("/login", async (req,res)=>{
    res.render('login');
});

app.get("/register", async (req,res)=>{
    res.render('register');
});

app.post("/login", passport.authenticate('local', {
    failureRedirect : "/login",
    successRedirect : "/ChatApp"
}), async (req,res)=>{

});

//creation of user 
app.post("/register",async (req,res)=>{
    console.log(req.body);
    let user = new User({
        name: req.body.name,
        username: req.body.username,
        password: hashSync(req.body.password, 10)
    });

    let savedUser = await user.save()
   res.redirect("/login");
});

app.get("/ChatApp", async (req,res)=>{
    console.log(req.user);
    user = req.user;

    if(req.isAuthenticated()){
        return res.render('chatapp.ejs');
    }
    res.redirect("/login");
})

app.get("/logout", (req, res)=>{
    req.logout((err)=>{
        if(err) console.log(err);
        res.redirect("/login");
    });
})

//// Sockets
let io = socket(server);

io.sockets.on('connection', (socket)=>{

    //console.log(socket);
    console.log("A new user joined");
    io.emit('userjoined',user);
    socket.on('new-msg', (data)=>{
        console.log(data);
        socket.broadcast.emit('new-msg', data);
    });

    socket.on('typing',()=>{
        console.log(user);
        socket.broadcast.emit('typing', user);
    });

});




