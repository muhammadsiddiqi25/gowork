import express from 'express'
const router = express.Router();
import { get_pricing,set_pricing } from '../Controllers/generalController.js';


router.get('/get-pricing',get_pricing)
router.post('/set-pricing',set_pricing)



export default router;