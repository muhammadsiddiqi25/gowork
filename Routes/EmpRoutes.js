import express from 'express'
const router = express.Router();
import { get_pricing } from '../Controllers/EmpController.js';


router.get('/get-pricing',get_pricing)



export default router;