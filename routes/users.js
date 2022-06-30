const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const userController = require('../controllers/user')
const validateEmail = require('../utils/validateEmail')

router.route('/register')
        .get(userController.registerRender)
        .post(validateEmail, catchAsync(userController.registerAction))

router.route('/login')
        .get(userController.loginRender)
        .post(passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),
                userController.loginAction)
// failureFlash tao. flash
// failureRedirect tu. redirect lun 

router.get('/logout',userController.logoutAction)

module.exports = router