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

function questDiv() {
  let div = document.createElement("div");
  div.setAttribute("class", "row my-5");
  return div;
}

function questInnerDiv() {
  let div = document.createElement("div");
  div.setAttribute("class", "row my-3 justify-content-center");
  return div;
}

function colDiv() {
  let div = document.createElement("div");
  div.setAttribute("class", "col-6 bg-light rounded-2");
  return div;
}

function questNoH4(count) {
  let h4 = document.createElement("h4");
  h4.setAttribute("class", "text-center my-2");
  h4.innerHTML = `Question ${count}`;
  return h4;
}

function questTextP(question) {
  let p = document.createElement("p");
  p.setAttribute("class", "text-center");
  p.innerHTML = question;
  return p;
}

function accordionDiv() {
  let div = document.createElement("div");
  div.setAttribute("class", "accordion accordion-flush my-2");
  return div;
}

function accordionItem() {
  let div = document.createElement("div");
  div.setAttribute("class", "accordion-item");
  return div;
}

function accordionHeader(questionID) {
  let h2 = document.createElement("h2");
  h2.setAttribute("class", "accordion-header");
  let button = document.createElement("button");
  button.setAttribute("class", "accordion-button collapsed mx-2");
  button.setAttribute("type", "button");
  button.setAttribute("data-bs-toggle", "collapse");
  button.setAttribute("data-bs-target", `#${questionID}`);
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", "collapseone");
  button.innerHTML = "Options";
  h2.appendChild(button);
  return h2;
}

function accordionCollapse(questionID) {
  let div = document.createElement("div");
  div.setAttribute("class", "accordion-collapse collapse");
  div.setAttribute("id", questionID);
  div.setAttribute("aria-labelledby", "collapseone");
  return div;
}

function accordionBody() {
  let div = document.createElement("div");
  div.setAttribute("class", "accordion-body");
  return div;
}

function renderOptions(options, questionID) {
  let div = accordionBody();
  options.forEach((option) => {
    let radio = document.createElement("input");
    radio.setAttribute("type", "radio");
    radio.setAttribute("name", questionID);
    radio.setAttribute("value", option.id);
    radio.setAttribute("data-law", option.law);
    radio.setAttribute("data-category", option.category);
    radio.setAttribute("id", option.id);
    radio.setAttribute("class", "form-check-input");
    let label = document.createElement("label");
    label.setAttribute("class", "form-check-label");
    label.innerHTML = option.option;
    let div2 = document.createElement("div");
    div2.setAttribute("class", "form-check");
    div2.appendChild(radio);
    div2.appendChild(label);
    div.appendChild(div2);
  });
  return div;
}

/* 
  questDiv
    questInnerDiv
      colDiv
        questNoH4
        questTextP
        accordion
          accordionItem
            accordionHeader
            accordionCollapse
              acccordionBody
                renderOptions

*/

function options(questions) {
  let form = document.getElementById("qual_form");
  form.addEventListener("submit", (e) => handleSubmit(e));
  let count = 0;
  questions.forEach((question) => {
    count++;
    const quest = questDiv();
    form.appendChild(quest);
    const questInner = questInnerDiv();
    quest.appendChild(questInner);
    const col = colDiv();
    col.appendChild(questNoH4(count));
    col.appendChild(questTextP(question.question));
    questInner.appendChild(col);
    let accord = accordionDiv();
    col.appendChild(accord);
    let accordItem = accordionItem();
    accord.appendChild(accordItem);
    accordItem.appendChild(accordionHeader(question.id));
    let accordColla = accordionCollapse(question.id);
    accordItem.appendChild(accordColla);
    getOptions(question.id).then((snapshot) => {
      const options = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      document
        .getElementById(question.id)
        .appendChild(renderOptions(options, question.id));
    });
  });
  const saveButton = document.createElement("button");
  saveButton.id = "save-progress";
  saveButton.setAttribute("class", "btn btn-secondary w-25 align-self-center");
  saveButton.innerText = "Save Progress";
  saveButton.addEventListener("click", () => saveProgess());
  const submitButton = document.createElement("button");
  submitButton.setAttribute("type", "submit");
  submitButton.setAttribute(
    "class",
    "btn btn-secondary w-25 align-self-center"
  );
  submitButton.innerHTML = "Submit";
  form.appendChild(submitButton);
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

function saveProgess() {
  // TODO
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
