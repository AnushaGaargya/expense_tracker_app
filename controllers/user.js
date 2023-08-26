require('dotenv').config();
const User = require('../models/user');
const Expense = require('../models/expense');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')




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
              
                const username = existing_users[i].username
                const user = {name: username}
            
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                console.log(accessToken)
                res.cookie('accessToken', accessToken, {httpOnly:true})
                // res.set('Authorization', `Bearer ${accessToken}`);
                // res.json({accessToken: accessToken})
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



exports.getHome = async (req,res,next) => {
    
    // const authHeader = req.headers['Authorization']
    // console.log(authHeader)
    // const token = authHeader && authHeader.split(' ')[1]
    const token = req.cookies.accessToken;
    console.log(`this is my token ${token}`)
    if (token == null) return res.sendStatus(401)

   //verifying if it's the correct token
   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err,user) => {
    if(err){return res.sendStatus(403)} else{ 
        console.log('we are at get home')
        const username = user.name
        const userId = await User.findAll({where: {username:username}})
        console.log(`thisis the user ${username}`)
        const userexpense = await Expense.findAll({
            where: { userId: userId[0].id },
          });
          console.log(userexpense);
          for (var i = 0; i<userexpense.length; i++){
            console.log(userexpense[i].dataValues.category)
            console.log(userexpense[i].dataValues.description)
            console.log(userexpense[i].dataValues.amount)
           console.log('---------------------') 
          }
        // req.user = user
        // console.log(user.name)
        // console.log(`testinggg ${req.user}`)
        
        res.render('home', {username: username, userexpense: userexpense});
    }
        req.user = user
        console.log(user)
    
})}

exports.postHome = async (req,res,next) => {
    console.log("we are at post home")
    const category = req.body.category
    const description = req.body.description 
    const amount = req.body.amount
    const username = req.body.username
    const userId = await User.findAll({where: {username:username}})
    console.log(category)
    console.log(description)
    console.log(amount)
    Expense.create({
        category: category,
        description: description,
        amount: amount,
        userId: userId[0].id
    }).then(result => {
        // req.flash('success', 'Registration Successful. Please Login to continue.');
        res.redirect('/home')
    }).catch(err => {console.log(err)})

    res.redirect('home')

}

exports.getLogOut = (req,res,next) => {
    res.clearCookie('accessToken');

    // Redirect to a login page or any other appropriate page
    res.redirect('/login');
}

// exports.authenticateToken= (req,res,next) => {
//     //checking for the token
//     console.log('authenticate middleware')
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]
//     console.log(`this is my token ${token}`)
//     if (token == null) return res.sendStatus(401)

//    //verifying if it's the correct token
//    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
//     if(err) return res.sendStatus(403)
//     req.user = user
//     next()
//    })
// }


