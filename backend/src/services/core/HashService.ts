import * as argon2 from 'argon2';

export class HashService {
    async hash(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return await argon2.verify(hash, password);
    }
}