import {
  collection,
  getFirestore,
  onSnapshot,
  query,
} from "firebase/firestore";
import { app } from "../config";
const firestore = getFirestore(app);

export function Qualification() {
  const questionsRef = collection(firestore, "qualQues");
  const questionsQuery = query(questionsRef);
  onSnapshot(questionsQuery, (snapshot) => {
    const questions = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    options(questions);
  });
}

function getOptions(questionID) {
  const optionsCol = collection(firestore, "qualQues", questionID, "options");
  const optionsQuery = query(optionsCol);
  const stream = (callback) =>
    onSnapshot(optionsQuery, (snapshot) => {
      const options = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      callback(options);
    });

  return stream;
}

function options(questions) {
  let form = document.getElementById("qual_form");
  let div;
  let label;
  let radioInput;
  let span;
  let el;
  questions.forEach((question) => {
    div = document.createElement("div");
    label = document.createElement("label");
    radioInput = document.createElement("input");
    radioInput.setAttribute("type", "radio");
    span = document.createElement("span");
    div.setAttribute("id", question.id);
    label.innerHTML = question.question;
    div.appendChild(label);
    form.appendChild(div);
    getOptions(question.id)((options) => {
      el = document.getElementById(question.id);
      options.forEach((option) => {
        radioInput.setAttribute("id", option.id);
        radioInput.setAttribute("name", question.id);
        span.innerHTML = option.option;
        el.appendChild(radioInput);
        el.appendChild(span);
      });
    });
  });
  const input = document.createElement("input");
  input.setAttribute("type", "submit");
  input.setAttribute("value", "submit");
  form.appendChild(input);
}
