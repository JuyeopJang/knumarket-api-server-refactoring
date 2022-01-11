import * as jwt from 'jsonwebtoken';
import { jwtSecret } from '../config';

export const jwtSign = (payload, expiresIn, options?) => {
    return jwt.sign(payload, jwtSecret, {
        algorithm: 'HS256',
        expiresIn: expiresIn,
        ...options,
    });
}

export const jwtVerify = (token, options?) => {
    return jwt.verify(token, jwtSecret, options);
}