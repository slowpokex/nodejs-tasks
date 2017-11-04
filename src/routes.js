import { Router } from 'express';

import userRouter from './models/user/router';
import productRouter from './models/product/router';
import reviewRouter from './models/review/router';

const router = new Router();

router
  .route('/')
  .get((req, res) => {
    res.json({
      message: 'Main page',
    });
  });

router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/reviews', reviewRouter);

export default router;
