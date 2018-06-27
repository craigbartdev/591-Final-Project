var express = require('express');
var router = express.Router();
const passport = require('passport');
const Base64 = require('js-base64').Base64;

router.get('/google', passport.authenticate('google', {
  scope: ['profile',
  "https://www.googleapis.com/auth/youtube"],
  accessType: 'offline',
  prompt: 'consent'
}));

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    //res.send(req.user) //sends user json
    const token = Base64.encode(req.user.access_token);
    const refresh = Base64.encode(req.user.refresh_token)
    res.redirect('http://localhost:4200/user/' + token + '/' + refresh);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('http://localhost:4200');
});


module.exports = router;
