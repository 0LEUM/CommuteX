
'use client';
import {
  Auth, 
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';

type ErrorCallback = (error: any) => void;

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string, onError?: ErrorCallback): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .then(userCredential => {
      // User created, now create their profile document in Firestore.
      const user = userCredential.user;
      if (!user) return;

      const firestore = getFirestore(authInstance.app);
      const userDocRef = doc(firestore, 'users', user.uid);
      
      const profileData = {
        email: user.email,
        createdAt: serverTimestamp()
      };

      // Set the document, non-blocking
      setDoc(userDocRef, profileData)
        .catch(error => {
          // Emit a structured error for better debugging if the profile creation fails.
          errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
              path: userDocRef.path,
              operation: 'create',
              requestResourceData: profileData,
            })
          );
          // Also invoke the original error callback if provided.
          if (onError) {
            onError(error);
          }
        });
    })
    .catch(onError);
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string, onError?: ErrorCallback): void {
  signInWithEmailAndPassword(authInstance, email, password).catch(onError);
}

    
