import argon2 from 'argon2';

export class HashService {
    static async hash(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    static async verify(password: string, hash: string): Promise<boolean> {
        return await argon2.verify(hash, password);
    }
}