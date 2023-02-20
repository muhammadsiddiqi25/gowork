import express from 'express'
import { login, register, getOtp, verifyOtp, resendOtp , adminLogin} from '../Controllers/AuthController.js';
const router = express.Router();


router.post('/login',login)
router.post('/register',register)
router.post('/verify-otp',verifyOtp)
router.get('/resend-otp',resendOtp)
router.get('/getuser/:id',)



// ----------ADMIN------------

router.post('/admin-login',adminLogin)

export default router