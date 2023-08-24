const User = require('../models/user');

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
        attributes: ['username','email']
    });
    
    let email_flag = false;
    let username_flag = false;
    for (var i = 0; i < existing_emails.length; i++) {
        // console.log(`email present in db ${existing_emails[i]['dataValues']['email']}`)
        console.log(`NEW** email present in db ${existing_emails[i].email}`)
        if (email === existing_emails[i].email){
            email_flag = true
            break
       }
       if (username === existing_emails[i].username){
            username_flag = true
       }
    }
    
    if(email_flag===false && username_flag===false){
        console.log('new user')

        User.create({
            fullname: fullname,
            phone: phone,
            username: username,
            email: email,
            password: password
        }).then(result => {
            req.flash('success', 'Registration Successful. Please Login to continue.');
            res.redirect('/login')
        }).catch(err => {console.log(err)})
    }
    else if(email_flag===true){
        console.log('email is already registered.')
        req.flash('error', 'This email is already registered. Click on "Login" to continue');
        res.redirect('/register')
    }
    else if(username_flag===true){
        console.log('username not available. try a different name')
        req.flash('error', 'This username is not available. Try a different name');
        res.redirect('/register')

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
            if(password===existing_users[i].password){
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
    if (user_exists_flag === false){
        req.flash('error', 'This email is not registered. Please click on "register" down below.')
      
        res.redirect('login')
    }
    }
}

exports.getHome = (req,res,next) => {
    res.render('home')
}