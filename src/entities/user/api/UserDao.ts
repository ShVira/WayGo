import { UserType } from "../model/UserType";

const USERS_KEY = "waygo_registered_users";

export default class UserDao {
    // 1. Get all users from local storage
    private static getAllUsers(): UserType[] {
        const data = localStorage.getItem(USERS_KEY);
        return data ? JSON.parse(data) : [];
    }

  static authenticate(login: string, password: string): Promise<UserType | null> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const users = this.getAllUsers();
            
            // Look for a user where BOTH login and password match
            const foundUser = users.find(u => u.login === login && u.password === password);

            if (foundUser) {
                resolve(foundUser);
            } else if (login === "user" && password === "123") {
                // Keep your admin backdoor
                resolve({
                    name: "Admin",
                    login: "user",
                    email: "admin@test.com",
                    address: "Odesa",
                    dob: "01/01/2000",
                    imageUrl: "..."
                });
            } else {
                resolve(null);
            }
        }, 700);
    });
    }
static register(userData: UserType, password: string): Promise<UserType | string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const users = this.getAllUsers();
            
            if (users.find(u => u.login === userData.login)) {
                return resolve("Цей логін вже зайнятий"); 
            }

            // IMPORTANT: Attach the password to the user object before saving
            const newUser = { ...userData, password }; 
            
            users.push(newUser);
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            resolve(newUser);
        }, 1000);
    });
}
    
}
