import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { database } from "../core/firebase/firebase";
import { IUserState } from "./types";

export const getUserDataByUid = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(collection(database, "users"), uid));
    if (userDoc.exists()) {
      return userDoc.data() as IUserState;
    } else {
      console.error(`No user found for UID: ${uid}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
