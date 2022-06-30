module.exports = (req, res, next) => 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email))
  {
    next()
  }
  else
  {
    req.flash('error',`You have entered an invalid email address!`)
    res.redirect('/register')
  }
}