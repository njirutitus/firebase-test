import {
  collection,
  getFirestore,
  onSnapshot,
  query,
} from "firebase/firestore";
import { app } from "../config";
import { addNewDocument } from "./Firestore";
const firestore = getFirestore(app);

export function Qualification() {
  const questionsCol = collection(firestore, "qualQues");
  const questionsQuery = query(questionsCol);
  onSnapshot(questionsQuery, (snapshot) => {
    const questions = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    options(questions);
  });
}

function options(questions) {
  let form = document.getElementById("qual_form");
  form.addEventListener("submit", (e) => handleSubmit(e));
  let div;
  let label;
  questions.forEach((question) => {
    div = document.createElement("div");
    label = document.createElement("label");
    div.setAttribute("id", question.id);
    label.innerHTML = question.question;
    form.appendChild(div);
    div.appendChild(label);
    const streamOptions = getOptions(question.id);
    streamOptions((options) => {
      options.forEach((option) => {
        renderOption(option, question.id);
      });
    });
  });
  const input = document.createElement("button");
  input.setAttribute("type", "submit");
  input.innerHTML = "Submit";
  form.appendChild(input);
}

function renderOption(option, questionID) {
  let el = document.getElementById(questionID);
  let div = document.createElement("div");
  el.appendChild(div);
  let radioInput = document.createElement("input");
  radioInput.setAttribute("type", "radio");
  radioInput.setAttribute("id", option.id);
  radioInput.setAttribute("value", option.id);
  radioInput.setAttribute("name", questionID);
  radioInput.setAttribute("data-law", option.law);
  radioInput.setAttribute("data-category", option.category);
  let span = document.createElement("span");
  span.innerHTML = option.option;
  div.appendChild(radioInput);
  div.appendChild(span);
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

function handleSubmit(e) {
  e.preventDefault();
  const qualData = new FormData(e.target);
  const data = {};
  const answers = [];
  for (let [key, value] of qualData.entries()) {
    data[key] = value;
    let input = document.getElementById(value);
    let law = input.dataset.law;
    let category = input.dataset.category;
    answers.push({ optionId: value, law, category });
  }
  addNewDocument("qualAnswers", data);
  window.location.href = "./assessment.html";
  sessionStorage.setItem("answers", JSON.stringify(answers));
}
