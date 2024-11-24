const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


// Configure Passport to use Auth0
passport.use(
    new Auth0Strategy(
        {
            domain: process.env.ISSUER.replace('https://', ''),
            clientID: process.env.CLIENTID,
            clientSecret: process.env.CLIENTSECRET,
            callbackURL: `${process.env.BASEURL}/callback`,
        },
        (accessToken, refreshToken, extraParams, profile, done) => {
            return done(null, profile);
        }
    )
);

// Serialize and deserialize users for session
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Configure session management
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the public directory
app.use(express.static('public'));

// Login route
app.get('/login', passport.authenticate('auth0', {
    scope: 'openid profile email'
}));

// Callback URL after Auth0 authentication
app.get('/callback',
    passport.authenticate('auth0', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/home');
    }
);

// Home route (protected)
app.get('/home', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.sendFile(__dirname + '/public/home.html');
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

// Root route for serving index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
