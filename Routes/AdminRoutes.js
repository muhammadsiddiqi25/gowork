import express from 'express'
const router = express.Router();
import { set_pricing } from '../Controllers/AdminController.js';


router.post('/set-pricing',set_pricing)



export default router;