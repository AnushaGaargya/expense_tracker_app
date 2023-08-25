exports.getHome = (req,res,next) => {
    console.log('we are at get home')
    res.render('home')
}

exports.postHome = (req,res,next) => {
    console.log("we are at post home")
    const category = req.body.category
    const description = req.body.description 
    const amount = req.body.amount
    console.log(category)
    console.log(description)
    console.log(amount)
    res.redirect('home')

}