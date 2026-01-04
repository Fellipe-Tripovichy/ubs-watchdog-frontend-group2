import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, sendEmailVerification, onAuthStateChanged, getAuth, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export const createUserWithEmailAndPasswordAPI = async (email: string, password: string, name: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            await updateProfile(userCredential.user, { displayName: name });
            await sendEmailVerification(userCredential.user);
            return userCredential.user;
        })
        .catch(() => {
            return null;
        });
}

export const signInWithEmailAndPasswordAPI = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            return userCredential.user;
        })
        .catch(() => {
            return null;
        });
}

export const signOutAPI = async () => {
    return signOut(auth)
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
}

export const getUserDataAPI = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            if (user) {
                resolve(user);
            } else {
                resolve(null);
            }
        }, (error) => {
            unsubscribe();
            reject(error);
        });
    });
}

export const resetPasswordAPI = async (email: string) => {
    return sendPasswordResetEmail(auth, email)
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
}