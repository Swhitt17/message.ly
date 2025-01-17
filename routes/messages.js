const Router = require("express ").Router();
const Message = require("../models/message");
const { ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");
const ExpressError = require("../expressError");

const router = new Router();


/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get('/:id', ensureLoggedIn, async(req,res,next) => {
    try{
        let username = req.params.username;
        let msg = await Message.get(req.params.id);
        if(msg.to_user_username !== username && msg.from_user.username !== username){
            throw new ExpressError("Cannot get this message", 404);
        }

        return res.json({message: msg});

    }
    catch(e){
        return next(e);
    }
});


router.post('/', ensureLoggedIn, async(req,res,next) => {
    try{
        let msg = await Message.create({
            from_username: req.user.username,
            to_username: req.body.to_username,
            body: req.body.body
        });
      return res.json({message: msg});

    }
    catch(e){
        return next(e);
    }
});



router.post('/:id/read', ensureLoggedIn, async(req,res,next) => {
    try{
        let username = req.params.username;
        let msg = await Message.get(req.params.id);
        if(msg.to_user_username !== username){
            throw new ExpressError("Cannot mark this message to read", 401);
        }
        let message = await Message.markRead(req.params.id);


      return res.json({message});

    }
    catch(e){
        return next(e);
    }
});

module.exports = router;



