const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user, done) => { //after user is added or read for cookie
  done(null, user.id);
});

passport.deserializeUser((id, done) => { //get id back from browser
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: keys.google.callbackURL,
    passReqToCallback: true
  }, (request, accessToken, refreshToken, profile, done) => {
    User.findOne({googleId: profile.id}).then((currentUser) => {
      if(currentUser){
        //have user
        console.log('user is', currentUser);
        done(null, currentUser)
      } else{ //add user
        new User({
          username: profile.displayName,
          googleId: profile.id,
          access_token: accessToken,
          refresh_token: refreshToken
        }).save().then((newUser) => {
          console.log('new user created:' + newUser);
          done(null, newUser);
        });
      }
    })
    
  })
);