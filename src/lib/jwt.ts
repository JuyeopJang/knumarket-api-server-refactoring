import * as jwt from 'jsonwebtoken';
import { jwtSecret } from '../config';

export const jwtSign = (payload, options?) => {
    return jwt.sign(payload, jwtSecret, {
        algorithm: 'HS256',
        expiresIn: '1d',
        ...options,
    }, (err: Error, encoded: string) => {
        if (err) console.error(err);
        else return encoded
    });
}

export const jwtVerify = (token, options?) => {
    return jwt.verify(token, jwtSecret, options);
}