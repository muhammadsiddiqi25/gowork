import User from "../Models/User.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import SgMail from '@sendgrid/mail'
import Otp from "../Models/Otp.js";
import jwtDecode from "jwt-decode";
import * as schedule from 'node-schedule'
dotenv.config()

import nodeMailgun from 'nodemailer-mailgun-transport'
import FreeTrial from "../Models/FreeTrial.js";
import Pricing from "../Models/Pricing.js";


export const login = async (req, resp) => {
    const { email, password } = req.body;
    const user = await User.findOne({email:email})
    if(!user || user.role=='admin' || user.role=='blogger'){
        return resp.status(404).json({message:'User not Found'})
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if(checkPassword){
        const token = jwt.sign(
            {
                userId: user._id,
            username: user.username,
            userEmail: user.email,
            userRole:user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_LIFETIME,
            }
        );
        
        return resp.status(201).json({
            user:{user_id: user._id,
            email: user.email,
            username: user.username,
            verified:user.verified,
            role: user.role,},
            token
        })
    }
    else{
        return resp.status(400).json({message:'Email or Password is wrong!'})
    }
}



export const register = async (req, res) => {
    const { email, username, password, role } = req.body;
    const email_exists = await User.findOne({ email: email });
    const username_exists = await User.findOne({ username: username })
    if (email_exists) {
        return res.status(400).json({ 'message': "Email Already Exists" })
    }
    if (username_exists) {
        return res.status(400).json({ 'message': "Usernames Already Exists" })
    }
    if (!email || !username || !password || !role) {
        return res.status(400).json({ 'message': 'Please provide all required fields.' })
    }
    const hashed_password = await bcrypt.hash(password, 10);
    try{
        sendOtp(email)
    }
    catch(e){
        return res.status(400).json({message:'Cannot Send verification Email, please try again!'})
    }
    const user = await User.create({ email, username, password: hashed_password, role })
    var currentTime = new Date()
    const price= await  Pricing.find({title:"Free Trial"})

    const roughtime = currentTime.setSeconds(currentTime.getSeconds()+20);
    const expTime = currentTime.setDate(currentTime.getDate() + price.duration);

    console.log(price.duration, roughtime)
    if(user.role == 'employer'){
        const freetrial = await FreeTrial.create({user_id:user._id})
        schedule.scheduleJob(roughtime,async ()=>{
            await FreeTrial.findOneAndUpdate({user_id:user._id},{expired:true})
        })
    }
    const token = jwt.sign(
        {
            userId: user._id,
            username: user.username,
            userEmail: user.email,
            userRole:user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME,
        }
    );
    
    return res.status(201).json({
        user:{user_id: user._id,
        email: email,
        username: username,
        role: role,},
        token
    })
}


// -----------------MAIL TRANSPORTER-------------



const sendOtp = async(email)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail', // use a service that allows you to send emails (e.g. Gmail, Outlook, etc.)
        auth: {
          user: process.env.SENDER_MAIL, // your email address
          pass: process.env.MAIL_PSWD // your email password
        }
      });
      const new_otp = generateOTP();
      console.log({email:email,otp:new_otp})
      await Otp.create({email:email, otp:new_otp})
      const mailOptions = {
        from: process.env.SENDER_MAIL, // sender address
        to: email, // list of receivers
        subject: "Please Verify your Identity", // Subject line
        text: `6-Digit Pin: ${new_otp}`, // plain text body
        html: `6-Digit Pin:<b>${new_otp}</b> ` // html body
      };
      
      // send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          throw error
        } 
      });
}

// OTP Generator 
const generateOTP = () => {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};


export const verifyOtp = async (req,resp) =>{
    const {otp} = req.body
    console.log(otp)
    const {userId, userEmail} =jwtDecode(req.headers.authorization.split(' ')[1])
    const otpMatch = await Otp.find({email:userEmail})
    console.log(otpMatch)
    if(otpMatch[0]){
        console.log('exists')
        if(otpMatch[0].otp === otp){
            console.log('matched')
            console.log({o:otpMatch[0].otp})
            await User.findOneAndUpdate({id:userId}, {verified:true})
            console.log('updated')
            return resp.status(200).json({'message':'Verification Successfull!'})
        }
        else 
        return resp.status(400).json({'message':'Either OTP is expired or not correct!'})
    }
    else 
        return resp.status(400).json({'message':'Either OTP is expired or not correct!'})
}


export const getOtp = async (req,resp) =>{
    return sendOtp(req,resp)
}

export const resendOtp = async (req,resp) =>{
    const token = req.headers['authorization']
    const bearerToken = token.split(' ')[1]
    const {userEmail} = jwtDecode(bearerToken)
    const userExists = await Otp.findOne({email:userEmail})
    console.log(userExists)
    if(userExists){
        await Otp.deleteMany({userEmail})
    }   

    try{
        sendOtp(userEmail)
        return resp.status(200).json({message:"Verification Email sent Successfully!"})
    }
    catch(err){
        console.log(err)
        return resp.status(400).json({message:"Failed to send verification email!"})
    }
}


export const getUser = async (req,resp) =>{
    const {id} = req.params
    const user = await User.find({user_id:id})
    if(user){
        return resp.status(200).json(user)
    }
    else  return resp.status(404).json({message:'User not Found'})
}




// --------------------------ADMIN---------------------------------

export const adminLogin = async(req,resp)=>{
    const { email, password } = req.body;
    const user = await User.findOne({email:email})
    console.log(user)
    if(user.role == 'admin'){
        console.log('heel')
    }
    else{
        console.log('ppppp')
    }
    if(!user || user.role=='candidate' || user.role=='employer'){
        return resp.status(404).json({message:'User not Found'})
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if(checkPassword){
        const token = jwt.sign(
            {
                userId: user._id,
            username: user.username,
            userEmail: user.email,
            userRole:user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_LIFETIME,
            }
        );
        
        return resp.status(201).json({
            user:{user_id: user._id,
            email: user.email,
            username: user.username,
            verified:user.verified,
            role: user.role,},
            token
        })
    }
    else{
        return resp.status(400).json({message:'Email or Password is wrong!'})
    }
}