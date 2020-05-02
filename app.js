/*--app.js--------------------------APP configuration -----------------------------------------------------*/


/* Module dependencies */
const express = require('express');
const path = require('path');

/* Import middleware */
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

/* Import routes  */
const routes = require('./server/routes/index');
/*
const userRoutes = require('./server/routes/user');
const cartRoutes = require('./server/routes/cart');
const orderRoutes = require('./server/routes/order');*/


// Express-session and connect-pg-simple to store data in session. Kilde: https://openbase.io/js/connect-pg-simple
const pg = require('pg')
    , session = require('express-session')
    , pgSession = require('connect-pg-simple')(session);

const pgPool = new pg.Pool({
    // Insert pool options here
    host: "localhost",
    port: 5433,
    user: "testUser",
    database: "testdb",
    password: "password",
});


const flash = require('connect-flash');


/* Server configuration */
const app = express ();
const port = process.env.PORT || 3000; //kilde: https://www.youtube.com/watch?v=pKd0Rpw7O48


/* All environments */

// Set views and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));


// Apply cookie session middleware
app.use(session({ // Using session to flash messages
   store: new pgSession({
        pool: pgPool,
        tableName: 'session'
    }),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 180 * 60 * 1000 } // How long a session should live in ms, 1 hour.
}));

//Cookie and body-parser middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded ({
        extended: true,
    })
);

app.use(flash());


/* Endpoints  */
app.use('/', routes);
/*
app.use('/user', userRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
*/


// Error-handling middleware. Kilde: https://www.hacksparrow.com/webdev/express/custom-error-pages-404-and-500.html
// Handle 404
app.use(function(req, res) {
    res.status(404);
    res.render('error', {title: '404: File Not Found'});
});

// Handle 500
app.use(function(error, req, res, next) {
    console.log(error);
    res.status(500);
    res.render('error', {
        title:'500: Internal Server Error'});
});


/* Connect to server */
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});
