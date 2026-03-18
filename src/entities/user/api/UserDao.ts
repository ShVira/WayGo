import { UserType } from "../model/UserType";

const USERS_KEY = "waygo_registered_users";

export default class UserDao {
    // 1. Get all users from local storage
    private static getAllUsers(): UserType[] {
        const data = localStorage.getItem(USERS_KEY);
        return data ? JSON.parse(data) : [];
    }

    // 2. Login Logic: Check against "Admin" OR registered users
    static authenticate(login: string, password: string): Promise<UserType | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = this.getAllUsers();
                
                // Check if user exists in our "database"
                // (Note: In this simple mock, we assume password is login + '123' or just '123')
                const foundUser = users.find(u => u.login === login);

                if (login === "user" && password === "123") {
                    resolve({
                        name: "Admin",
                        email: "user@i.ua",
                        address: "Odesa",
                        login: "user",
                        dob: "08/12/2025",
                        imageUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    });
                } else if (foundUser && password === "123") { // Standard mock password
                    resolve(foundUser);
                } else {
                    resolve(null);
                }
            }, 700);
        });
    }

    // 3. Register Logic: Save to the list
    static register(userData: UserType): Promise<UserType> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = this.getAllUsers();
                users.push(userData);
                localStorage.setItem(USERS_KEY, JSON.stringify(users));
                resolve(userData);
            }, 1000);
        });
    }
}