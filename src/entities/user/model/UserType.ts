// entities/user/model/UserType.ts
export interface UserType {
    login: string;
    name: string;
    email: string;
    imageUrl: string;
    address?: string;
    dob?: string;
    password?: string; // Add this!
}