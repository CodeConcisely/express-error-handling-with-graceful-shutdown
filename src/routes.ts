import 'express-async-errors';
import { NextFunction, Request, Response, Router } from 'express';
import { errorHandler } from './exceptions/ErrorHandler';
import { AppError, HttpCode } from './exceptions/AppError';

const router = Router();

const getUserFromDb = async () => {
  return new Promise(() => {
    throw new Error('This is an async error');
  });
};

router.get('/sync', (_, res: Response) => {
  throw new Error('This is a sync error');

  res.json({ status: 'error ' });
});

router.get('/async', async (_, res: Response) => {
  const user = await getUserFromDb();

  res.json(user);
});

router.get('/reject', async (_, res: Response) => {
  new Promise((_, reject) => {
    reject('This is a rejected promise');
  });

  res.json({ status: 'error' });
});

router.get('/user/:id', async (_, res: Response) => {
  if (!res.locals.user) {
    throw new AppError({ httpCode: HttpCode.UNAUTHORIZED, description: 'You must be logged in' });
  }

  const user = await getUserFromDb();

  if (!user) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'User you are looking for does not exist',
    });
  }

  res.json(user);
});

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('Error encountered:', err.message || err);

  next(err);
});

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler.handleError(err, res);
});

export default router;
