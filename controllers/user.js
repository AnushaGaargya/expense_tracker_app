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
        attributes: ['email']});
    
    let flag = false
    for (var i = 0; i < existing_emails.length; i++) {
        console.log(`email present in db ${existing_emails[i]['dataValues']['email']}`)
       if (email === existing_emails[i]['dataValues']['email']){
        flag = true
        break
       }
    }
    console.log(`flag - ${flag}`)
    
    if(flag===false){
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
    else{
        console.log('email is already registered.')
        req.flash('error', 'This email is already registered. Click on "Login" to continue');
        res.redirect('/register')
    } 
}

exports.getUserLogin = (req,res,next) => {
    const msg = req.flash('success')

   res.render('login', {msg})
}

exports.postUserLogin = async (req,res,next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password
    const existing_emails = await User.findAll({
        attributes: ['username', 'email', 'password']});

}