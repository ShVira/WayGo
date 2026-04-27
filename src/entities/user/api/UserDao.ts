import { UserType } from "../model/UserType";
import { db } from "../../../app/api/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export default class UserDao {
    private static COLLECTION = "users";

    static async getUser(uid: string): Promise<UserType | null> {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { uid, ...docSnap.data() } as UserType;
        }
        return null;
    }

    static async createUser(userData: UserType): Promise<void> {
        const docRef = doc(db, this.COLLECTION, userData.uid);
        await setDoc(docRef, {
            ...userData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    }

    static async updateUser(uid: string, data: Partial<UserType>): Promise<void> {
        if (!uid) return;
        const docRef = doc(db, "users", uid);
        const ts = serverTimestamp();
        await setDoc(docRef, {
            ...data,
            updatedAt: ts
        }, { merge: true });
    }
}
