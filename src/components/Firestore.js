import { async } from "@firebase/util";
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
    console.log("Document written with ID: ", newDoc.path);
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
  onSnapshot(ref, (snapshot) => {
    if (snapshot.exists) {
      console.log(snapshot.data());
    } else {
      console.log("No such document!");
    }
  });
}

// Query for documents

export async function queryForDocuments(collectionRef) {
  const ref = collection(firestore, collectionRef);
  //   const queryAll = query(ref);
  const querySnapshot = await getDocs(query(ref));
  if (querySnapshot.empty) {
    console.log("No matching documents.");
    return;
  }
  const questions = {};
  querySnapshot.forEach((doc) => {
    questions[doc.id] = doc.data();
  });
  console.log(questions);
}
