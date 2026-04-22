export interface UserType {
    uid: string;
    fullName: string;
    email: string;
    username: string;
    dateOfBirth: string;
    city: string;
    bio?: string;
    phoneNumber?: string;
    createdAt?: any; // Firestore Timestamp
    updatedAt?: any; // Firestore Timestamp
}
