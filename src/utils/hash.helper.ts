import bcrypt from 'bcrypt';

export async function hash(password: string, salt: number = 10): Promise<string> {
    return await bcrypt.hash(password, salt);
}

export async function compare(password: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
}