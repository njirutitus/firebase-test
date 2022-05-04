import { getDatabase, ref, onValue } from "firebase/database";
import { assessment } from "./components/Assessment";
import { display } from "./components/Display";
import {
  write,
  addNewDocument,
  readASingleDocument,
  listenToDocument,
  getQuestions,
} from "./components/Firestore";
import { Qualification } from "./components/Qualification";
import { DisplayQualificationQuestions } from "./components/QualificationQuestions";
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
  question: "Are assets a threat to your company?",
  questionType: "radio",
  options: {
    option1: {
      category: "SGOWZRNrKjVQ0scDRfza",
      laws: ["gULcLPDMGHtzuEor9ZFk"],
    },
    option2: {
      category: "SGOWZRNrKjVQ0scDRfza",
      laws: ["gULcLPDMGHtzuEor9ZFk"],
    },
    option3: {
      category: "SGOWZRNrKjVQ0scDRfza",
      laws: ["gULcLPDMGHtzuEor9ZFk"],
    },
  },
};

// write("AssessmentQues/005", data);
// addNewDocument("qualificationQuestions", data);
// readASingleDocument("AssessmentQues/005");
// listenToDocument("AssessmentQues/004");

// const stream = getQuestions("qualificationQuestions");

// stream((questions) => {
//   // display(questions);
//   DisplayQualificationQuestions(questions);
// });

// Qualification();
// assessment();

if (window.location.pathname === "/assessment") {
  assessment();
} else if (window.location.pathname === "/qualification") {
  Qualification();
}
