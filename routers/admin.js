/**
 * Created by bulusi on 2017/8/20.
 */

var router = require('express').Router();

router.get('/user',function(req,res,next){
    res.send('user')
})

module.exports = router;