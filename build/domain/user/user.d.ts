import { IEntity } from '../declarations';
import { UserData } from './declarations';
export default class User implements IEntity {
    protected id: string;
    protected email: string;
    protected password: string;
    protected username: string | null;
    constructor({ _id, email, password, username }: UserData);
    getId(): string;
    getEmail(): string;
    setEmail(email: string): void;
    getPassword(): string;
    setPassword(password: string): void;
    getUsername(): string | null;
    setUsername(username: string | null): void;
}
