const { where } = require('sequelize');
const User = require('../models/user');
const bcrypt = require('bcrypt')

exports.getUserRegister = (req,res,next) => {
// 
const msg = req.flash('error')
res.render('register', {msg} )
}

exports.postUserRegister = async (req,res,next) => {
    const fullname = req.body.fullname;
    const phone = req.body.phone;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password
    
    const existing_emails = await User.findAll({
        attributes: ['email'],
        where: {email: email}    
    });
    const existing_usernames = await User.findAll({
        attributes: ['username'],
        where: {username: username}
    })
    console.log(existing_emails)

if (existing_emails.length > 0){
    console.log(existing_emails[0]['email'])
    console.log('email is already registered.')
    req.flash('error', 'This email is already registered. Click on "Login" to continue');
    res.redirect('/register')
}
else if(existing_usernames.length > 0){
    console.log(existing_usernames[0]['username'])
    console.log('username not available. try a different name')
    req.flash('error', 'This username is not available. Try a different name');
    res.redirect('/register')
}

else {
    console.log('new user')
    const hash = await bcrypt.hash(password,10)
        User.create({
            fullname: fullname,
            phone: phone,
            username: username,
            email: email,
            password: hash
        }).then(result => {
            req.flash('success', 'Registration Successful. Please Login to continue.');
            res.redirect('/login')
        }).catch(err => {console.log(err)})
    }
}
 
exports.getUserLogin = (req,res,next) => {
    const msg = req.flash('success')
    const fail = req.flash('error')
    console.log(fail)
    if(msg.length > 0){
    res.render('login', {message: msg})
    }
    else if(fail.length > 0){
    res.render('login', {message: fail})
    }
    else{
        res.render('login', {message: []})
    }
    
}

exports.postUserLogin = async (req,res,next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password
    let user_exists_flag = false
    const existing_users = await User.findAll({
    attributes: ['username', 'email', 'password']});

    for (var i=0; i<existing_users.length; i++){
        if(email===existing_users[i].email){
            user_exists_flag = true
            const isMatch = await bcrypt.compare(password, existing_users[i].password )
            if(isMatch===true){
                // res.send('welcome home')
                console.log("perfect, taking you home")
                res.redirect('/home')
            }
            else{
                req.flash('error', 'Wrong Credentials. Try again.')
            
                res.redirect('login')
            }
            break
        }
    }
    if (user_exists_flag === false){
        req.flash('error', 'This email is not registered. Please click on "register" down below.')
      
        res.redirect('login')
    }
    
}

exports.getHome = (req,res,next) => {
    res.render('home')
}