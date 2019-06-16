const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const User = require('../../modals/users');
const gravator = require('gravatar');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const config = require('config');

// @route GET api/users
// @desc  Register User
// @access Public

router.post('/',[
    check('name','Name is Required')
    .not()
    .isEmpty(),
    check('email', 'Please Include Valid Email').isEmail(),
    check('password', 'Please enter a password with 6 or more charecters').isLength({min:6})
], async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {name, email, password} = req.body;

    try{
        let user = await User.findOne({email})

        if(user){
            return res.status(400).json({error:[{message:'User already Exist'}]})
        }

        const avatar = gravator.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password,salt);

        await user.save();

        const payload = {
            user: {
                id:user.id
            }
        }
        
        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            { expiresIn: 360000},
            (err,token)=>{
                if(err) throw err;
                res.json({token});
            }
        );

        //res.send('user register')
    } catch(err){
        console.log(err.message);
        res.status(500).send('Server error')
    }
    


    
});

module.exports = router;