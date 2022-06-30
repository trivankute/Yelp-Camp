const User = require('../models/user')

const registerRender = (req,res)=>{
    res.render('./users/register')
}

const registerAction = async (req,res)=>{
    try {
        const {email,username,password} =req.body
        const user = await new User({email,username})
        const newUser = await User.register(user, password)
        req.logIn(newUser,(err)=>{
            if(err) return next(err)
            else
            {
                req.flash('success',`Welcome to yelp-camp ${username.toUpperCase()}`)
                res.redirect('/campgrounds')
            }
        })
    }
    catch(e)
    {
        req.flash('error',e.message)
        res.redirect('/register')
    }
}

const loginRender = (req,res)=>{
    res.render('./users/login')
}

const loginAction = async (req,res)=>{
    req.flash('success',`welcome back ${req.user.username.toUpperCase()}`)
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

const logoutAction = (req,res)=>{
    req.logout()
    req.flash('success','Good bye')
    res.redirect('/campgrounds')
}

module.exports = {
    registerRender,
    registerAction,
    loginRender,
    loginAction,
    logoutAction
}