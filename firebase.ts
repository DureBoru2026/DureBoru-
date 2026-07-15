import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCUdIrg-Mc37V2HhXDHi_9NlLJeWVRqR88",
  authDomain: "biftu-beri-exam-system-b46a8.firebaseapp.com",
  projectId: "biftu-beri-exam-system-b46a8",
  storageBucket: "biftu-beri-exam-system-b46a8.firebasestorage.app",
  messagingSenderId: "572384885491",
  appId: "1:572384885491:web:b6e71172d4985a2d761586",
  databaseId: "ai-studio-dureboruethiopia-1d0bcebe-b085-461a-bec5-781e10a3a564"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
} as any, firebaseConfig.databaseId);
export const storage = getStorage(app);
