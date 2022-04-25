import { async } from "@firebase/util";
import { display } from "./Display";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  onSnapshot,
  query,
  getDocs,
} from "firebase/firestore";
import { app } from "../config";
const firestore = getFirestore(app);

// add/update document with id
export async function write(docRef, data) {
  const ref = doc(firestore, docRef);
  try {
    await setDoc(ref, data, { merge: true });
    console.log("Document written with ID: ", docRef);
  } catch (error) {
    console.log(error);
  }
}

// add a new document with a generated id
export async function addNewDocument(collectionRef, data) {
  const ref = collection(firestore, collectionRef);
  try {
    const newDoc = await addDoc(ref, data);
    sessionStorage.setItem("id", newDoc.id);
  } catch (error) {
    console.log(error);
  }
}

// read a single document
export async function readASingleDocument(docRef) {
  const ref = doc(firestore, docRef);
  const mySnapshot = await getDoc(ref);
  if (mySnapshot.exists()) {
    console.log(mySnapshot.data());
  } else {
    console.log("No such document!");
  }
}

// listen to a document
export async function listenToDocument(docRef) {
  const ref = doc(firestore, docRef);
  const stream = (callback) =>
    onSnapshot(ref, (snapshot) => {
      if (snapshot.exists) {
        callback(snapshot.data());
      } else {
        callback(null);
      }
    });
  return stream;
}

// Query for documents

export function getQuestions(collectionRef) {
  const ref = collection(firestore, collectionRef);
  const questionsQuery = query(ref);
  const stream = (callback) =>
    onSnapshot(questionsQuery, (snapshot) => {
      const questions = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      callback(questions);
    });

  return stream;
}
