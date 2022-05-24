import { async } from "@firebase/util";
import {
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
} from "firebase/firestore";
import { app } from "../config";
import { addNewDocument } from "./Firestore";
const firestore = getFirestore(app);

export function Qualification() {
  document.getElementById("qual_form").setAttribute("aria-busy", "true");
  fetchQuestions().then((questions) => {
    document.getElementById("qual_form").setAttribute("aria-busy", "false");
    options(questions);
  });
}

export async function fetchQuestions() {
  const questionsCol = collection(firestore, "qualQues");
  const questionsQuery = query(questionsCol);
  const snapshot = await getDocs(questionsQuery);
  if (snapshot.empty) {
    return [];
  }
  const questions = snapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return questions;
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
    div.setAttribute("aria-busy", "true");
    let qualQuestion = `<div class="row my-3 justify-content-center">
    <div class="col-6 bg-light rounded-2">
      <h4 class="text-center my-2">Question 1</h4>
      <!-- question text -->
      <p class="text-center">Do you store personal data?</p>
        <!-- collapsable options button -->
      <div class="accordion accordion-flush my-2">
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingone">
            <button class="accordion-button collapsed mx-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapseone" aria-expanded="false" aria-controls="collapseone">
              Options
            </button>
          </h2>
          <!-- options  -->
          <div id="collapseone" class="accordion-collapse collapse" aria-labelledby="headingone" data-bs-parent="#accordionExample">
            <div class="accordion-body">`;
    getOptions(question.id).then((snapshot) => {
      div.setAttribute("aria-busy", "false");
      const options = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
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

export async function getOptions(questionID) {
  const optionsCol = collection(firestore, "qualQues", questionID, "options");
  const optionsQuery = query(optionsCol);
  const snapshot = await getDocs(optionsQuery);

  return snapshot;
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
  addNewDocument("qualAnswers", data).then(() => {
    sessionStorage.setItem("answers", JSON.stringify(answers));
    window.location.href = "./assessment.html";
  });
}
