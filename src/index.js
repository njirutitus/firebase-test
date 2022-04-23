import { getDatabase, ref, onValue } from "firebase/database";
import { display } from "./components/Display";
import {
  write,
  addNewDocument,
  readASingleDocument,
  listenToDocument,
  getQuestions,
} from "./components/Firestore";
import { app } from "./config";

const db = getDatabase(app);
const reference = ref(db, "AssessmentQues/");

onValue(reference, (snapshot) => {
  const questions = snapshot.val();
  // display(questions);
});

const data = {
  quescat: "Criminal Law",
  quesid: "005",
  question: "What is the meaning of life?",
  queslaws: [
    {
      lawname: "Law 1",
      statements: "Statement 1",
    },
    {
      lawname: "Law 2",
      statements: "Statement 2",
    },
  ],
};

// write("AssessmentQues/005", data);
// addNewDocument("questions", data);
// readASingleDocument("AssessmentQues/005");
listenToDocument("AssessmentQues/004");

const stream = getQuestions("questions");

stream((questions) => {
  display(questions);
});
