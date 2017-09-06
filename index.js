const express = require('express');
const session = require('express-session');
const passport = require('passport');
const strategy = require('./strategy');

const app = express();

//Massive
//Body-Parser & others
//Express session

app.use(session({
    secret: 'gimmecodepls',
    resave: false,
    saveUninitialized: false,
}))

//Initialize passport and configure passport to use sessions
app.use(passport.initialize());
app.use(passport.session());

//Configure passport to use our required strategy.
passport.use(strategy);

passport.serializeUser(function (user, done) {
    //Gets user from Auth0 profile
    var userInfo = {
        id: user.id,
        displayName: user.displayName,
        nickname: user.nickname,
        email: user.emails[0].value
    }
    done(null, userInfo);
});

passport.deserializeUser(function (user, done) {
    done(null, user); //Puts this on req.user
});

app.get('/login', passport.authenticate('auth0', {
    successRedirect: '/me',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/me', (request, response, next) => {
    if (!request.user) {
        response.redirect('/login');
    } else {
        // req.user === req.session.passport.user
        // console.log( req.user )
        // console.log( req.session.passport.user )
        response.status(200).send(JSON.stringify(request.user));
    }
})

const port = 3000;
app.listen(port, () => { console.log(`Server listening on port ${port}`); });