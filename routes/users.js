const Router = require("express ").Router();
const User = require("../models/user");
const { ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");

const router = new Router();

router.get('/', ensureLoggedIn, async(req,res,next) => {
    try{
        let users = await User.all();
        return res.json({users});

    }
    catch(e){
        return next(e);
    }
})


router.get('/:username', ensureCorrectUser, async(req,res,next) => {
    try{
        let users = await User.get(req.params.username);
        return res.json({users});

    }
    catch(e){
        return next(e);
    }
})

router.get('/:username/to', ensureCorrectUser, async(req,res,next) => {
    try{
        let messages = await User.messagesTo(req.params.username);
        return res.json({messages});

    }
    catch(e){
        return next(e);
    }
})

router.get('/:username/from', ensureCorrectUser, async(req,res,next) => {
    try{
        let messages = await User.messagesFrom(req.params.username);
        return res.json({messages});
    }
    catch(e){
        return next(e);
    }
})

module.exports = router;