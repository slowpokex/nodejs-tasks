import { Router } from 'express';


import userRouter from './models/orm/routers/user';
import productRouter from './models/orm/routers/product';

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

export default router;
