import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../config";
import { addNewDocument } from "./Firestore";

export function assessment() {
  if (!sessionStorage.getItem("answers")) {
    window.location.href = "/qualification.html";
  }
  const answers = JSON.parse(sessionStorage.getItem("answers"));
  let form = document.getElementById("ass_form");
  form.addEventListener("submit", (e) => handleSubmit(e));
  let promise;
  answers.forEach((answer) => {
    promise = getAssessmentQuestions(answer.law, answer.category, form);
  });
  promise.then(() => {
    renderSubmitButton(form);
  });
}

async function getAssessmentQuestions(law, category, form) {
  const questionsCol = collection(firestore, "assessmentQuestions");
  const questionsQuery = query(questionsCol, where("category", "==", category));
  const snapshot = await getDocs(questionsQuery);
  const questions = snapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  questions.forEach((question) => {
    renderQuestion(question, form);
  });
  return snapshot;
}

function renderSubmitButton(form) {
  const submitButton = document.createElement("button");
  submitButton.setAttribute("type", "submit");
  submitButton.innerHTML = "Submit";
  form.appendChild(submitButton);
}

function renderQuestion(question, form) {
  let div = document.createElement("div");
  let label = document.createElement("label");
  div.setAttribute("id", question.id);
  label.innerHTML = question.question;
  form.appendChild(div);
  div.appendChild(label);
  let rangeInput = document.createElement("input");
  rangeInput.setAttribute("type", "range");
  rangeInput.setAttribute("id", question.id);
  rangeInput.setAttribute("name", question.id);
  rangeInput.setAttribute("min", "0");
  rangeInput.setAttribute("max", "10");
  rangeInput.setAttribute("value", "0");
  rangeInput.setAttribute("step", "1");
  div.appendChild(rangeInput);
  let span = document.createElement("span");
  span.innerHTML = "0";
  div.appendChild(span);
  rangeInput.addEventListener("input", (e) => handleRange(e));
}

function handleRange(e) {
  let span = e.target.nextSibling;
  span.innerHTML = e.target.value;
}

function handleSubmit(e) {
  e.preventDefault();
  const qualData = new FormData(e.target);
  const data = {};
  for (let [key, value] of qualData.entries()) {
    data[key] = value;
  }
  addNewDocument("assAnswers", data).then(() => {
    sessionStorage.removeItem("answers");
    window.location.href = "./success.html";
  });
}
