
import jwt, { JwtPayload } from 'jsonwebtoken';

export function generateToken(payload: object | string = {}, tokenSecret: string, expired: string | number): string {
    return jwt.sign(payload, tokenSecret as string, { expiresIn: expired });
}

export function verifyToken(token: string, tokenSecret: string): Promise<object | string | undefined> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, tokenSecret, (error, decoded) => {
            if (error) reject(error);
            resolve(decoded);
        });
    });
}

export function decodeToken(token: string): JwtPayload | string | null {
    return jwt.decode(token);
}