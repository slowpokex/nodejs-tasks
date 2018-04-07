import { Router } from 'express';
import controller from './controller';

const router = new Router();

router.route('/')
  .get((...args) => controller.find(...args))
  .post((...args) => controller.create(...args));

router.route('/:user')
  .put((...args) => controller.update(...args))
  .get((...args) => controller.findUser(...args))
  .delete((...args) => controller.remove(...args));

export default router;
