import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import transactionModel from "../models/transactionModel.js";



const registerUser = async (req, res)=>{
    try{
       const {name, email, password} = req.body;

       if(!name || !email || !password){
           return res.json({success:false, message: 'Missing Details'})
       }

       const salt = await bcrypt.genSalt(10)
       const hashedPassword = await bcrypt.hash(password, salt)

       const userData = {
        name,
        email,
        password: hashedPassword
       }

       const newUser = new userModel(userData)
       const user = await newUser.save()

       const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

       res.json({success: true, token, user: {name: user.name}})

    } catch (error){
       console.log(error)
       res.json({success: false, message: error.message})
    }
}

const loginUser = async (req, res)=>{
    try {
        const {email, password }= req.body;
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success: false, message: 'User does not exist'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(isMatch){
              const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
              res.json({success: true, token, user: {name: user.name}})

        } else{
            return res.json({success: false, message: 'Invalid Credentials'})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false , message: error.message})
    }
}

const userCredits = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;

    if (!userId) {
      return res.json({ success: false, message: "User ID not found" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      credits: user.creditBalance ?? 0, 
      user: { name: user.name },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const razorpayInstance =  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

const paymentRazorpay = async(req, res)=>{
    try {
        const { planId } = req.body
        const userId = req.userId || req.body.userId

        const userData = await userModel.findById(userId)

        if(!userData || !planId) {
            return res.json({success: false, message: 'Missing Details'})
        }

        let credits, plan, amount, date

        switch (planId) {
            case 'Basic':
                plan = 'Basic'
                credits = 1
                amount = 10
                break;

            case 'Advanced':
                plan = 'Advanced'
                credits = 5
                amount = 50
                break;

            case 'Business':
                plan = 'Business'
                credits = 10
                amount = 100
                break;
        
            default:
                return res.json({success: false, message: 'plan not found'});
        }

        date = Date.now();

        const transactionData = {
            userId, plan , amount,
            credits, date
        }
    const newTransaction = await transactionModel.create(transactionData)

      const options ={
        amount: amount * 100,
        currency: process.env.CURRENCY,
        receipt: newTransaction._id,
      }

      await razorpayInstance.orders.create(options, (error, order)=>{
         if(error){
            console.log(error)
            return res.json({success: false, message: error})
         }
         res.json({success: true, order})
      })

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.json({ success: false, message: 'Missing payment verification fields' });
        }

        // Verify signature
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return res.json({ success: false, message: 'Invalid signature' });
        }

        // fetch order to get the receipt (transaction id)
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        const transactionId = orderInfo.receipt;

        const transaction = await transactionModel.findById(transactionId);
        if (!transaction) {
            return res.json({ success: false, message: 'Transaction not found' });
        }

        if (transaction.payments) {
            return res.json({ success: false, message: 'Transaction already completed' });
        }

        // mark transaction as paid
        transaction.payments = true;
        await transaction.save();

        // add credits to user
        await userModel.findByIdAndUpdate(transaction.userId, {
            $inc: { creditBalance: transaction.credits || 0 },
        });

        res.json({ success: true, message: 'Payment verified and credits added', credits: transaction.credits || 0 });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay }