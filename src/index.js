import { getDatabase, ref, onValue } from "firebase/database";
import { display } from "./components/Display";
import {
  write,
  addNewDocument,
  readASingleDocument,
  listenToDocument,
  getQuestions,
} from "./components/Firestore";
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
    Yes: {
      category: "asset management",
      assessmentQuestion: [
        "How do you keep your assets?",
        "Do you use coso laws in your business?",
      ],
    },
    no: {
      category: "Software management",
      assessmentQuestion: [
        "How well do you keep your software?",
        "Do you use AIP laws in your firm?",
      ],
    },
  },
};

// write("AssessmentQues/005", data);
// addNewDocument("qualificationQuestions", data);
// readASingleDocument("AssessmentQues/005");
listenToDocument("AssessmentQues/004");

const stream = getQuestions("qualificationQuestions");

stream((questions) => {
  // display(questions);
  DisplayQualificationQuestions(questions);
});
