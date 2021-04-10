const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const checkAuth = require('../middleware/check-auth');
const crypto = require('crypto')
const shortid = require('shortid')

const instance = new Razorpay({
  key_id: 'rzp_test_KWmuBtFnG86iyt',
  key_secret: 'sheh9TNO741nZlynf9kWpo3b',
});

router.post('',checkAuth,(req,res,next)=>{
    console.log('Came');
    var options = {
        amount: req.body.amount,
        currency: "INR",
        receipt: shortid.generate()
      };
      instance.orders.create(options, function(err, order) {
        console.log(order);
        res.status(200).json(order);
      });
});

router.post('/verification',(req,res)=>{
  const secret = '123456789'
	console.log(req.body)
	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
    // here send the payment details to the database
    console.log('Success');
    res.json({ status: 'ok' })
	}

  else {
    res.json({status:'bad'})
    console.log('request is not a legit')
	}
	
})




module.exports = router;