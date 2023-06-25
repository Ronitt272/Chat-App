const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("../models/user");
const { compareSync } = require('bcrypt');
passport.use(new LocalStrategy(
    async function(username, password, done) {
      try{
        let user = await User.findOne({ username: username });
        if (!user) { return done(null, false); }
        if (!compareSync(password, user.password)) { return done(null, false); }
        return done(null, user);
      }
      catch(err){
        return done(err)
      }  
    }
  ));

  // used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id); 
  
});

// used to deserialize the user
passport.deserializeUser(async function(id, done) {
    let user = await User.findById(id);
    done(null, user);
});