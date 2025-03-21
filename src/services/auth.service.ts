import { envConfig } from '@/config/env.config';
import { UnauthorizedError } from '@/exceptions/unauthorizedError';
import { User } from '@/models/user.model';
import jwt from 'jsonwebtoken';

export class AuthService {
  static login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const user = await User.findOne({ email });

    if (!user || !(await user.verifyPassword(password))) {
      throw new UnauthorizedError(`Invalid login credentials`);
    }

    const jwtSignOptions: jwt.SignOptions = {
      expiresIn: envConfig.jwt.expiresIn,
      algorithm: 'HS256',
    };

    // Sign JWT, and generate token
    const token = jwt.sign(
      {
        userId: user.id,
      },
      envConfig.jwt.secretKey,
      jwtSignOptions,
    );

    return token;
  };
}
