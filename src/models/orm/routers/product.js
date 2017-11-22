import { Router } from 'express';
import controller from '../controllers/product';

const router = new Router();

router.route('/')
  .get((...args) => controller.all(...args))
  .post((...args) => controller.create(...args));

router.route('/:id')
  .get((...args) => controller.findById(...args));

router.route('/:id/reviews')
  .get((...args) => controller.getReviewsById(...args));

export default router;
