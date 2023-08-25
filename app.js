const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('./utils/database');
const User = require('./models/user');
const Expense = require('./models/expense')
const userRoutes = require('./routes/user');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');
const path = require('path')
const app = express()


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser('SecretStringForCookies'))

app.use(session({
    secret:'flashblog',
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 600000
    }
}));
  
app.use(flash());

// app.use(function(req, res, next){
//     res.locals.message = req.flash();
//     next();
// });

app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');


app.use(userRoutes);


User.hasMany(Expense)
Expense.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
})
sequelize.sync().then(result => {
    app.listen(3000);
});