const { setEngine } = require('crypto')
const express = require('express')
const app = express()



app.get('/login', (req,res,next) => {
    res.sendFile('/Users/anusha/Desktop/Sharpener/expense_tracker_express/views/login.html')
})

app.get('/register', (req,res,next) => {
    res.sendFile('/Users/anusha/Desktop/Sharpener/expense_tracker_express/views/register.html')
})


// app.get('/login', (req,res,next) => {
//     res.send('HELLO! WELCOME')
// })


app.listen(3000)