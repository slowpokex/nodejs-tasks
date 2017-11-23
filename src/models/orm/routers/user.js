import { Router } from 'express';
import controller from '../controllers/user';

const router = new Router();

router.route('/')
  .get((...args) => controller.all(...args));

export default router;
