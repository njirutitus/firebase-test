import { AssessmentQuestions } from "./AssessmentQuestions";
import { addNewDocument } from "./Firestore";

export function DisplayQualificationQuestions(questions) {
  document.addEventListener("submit", (e) => {
    if (e.target.id === "qual_form") {
      e.preventDefault();
      const qualData = new FormData(e.target);
      const data = {};
      for (let [key, value] of qualData.entries()) {
        data[key] = value;
      }
      addNewDocument("qualificationAnswers", data);
      AssessmentQuestions();
    }
    if (e.target.id === "ass_form") {
      document.getElementById("root").innerHTML =
        "<h5>You response has been Recorded. Thank you!<h5>";
    }
  });

  let form =
    '<form id="qual_form" method="post"><h3>Qualification Questions</h3>';
  questions.forEach((question) => {
    form += "<div>";
    form += "<label>" + question.question + "</label>";
    const options = question.options;
    for (let key in options) {
      form += `<div><input type="radio" name="${question.id}" value="${key}"/>${key}</div>`;
    }
    form += "</div>";
  });
  document.getElementById("root").innerHTML =
    form + '<input type="submit" value="submit"></form>';
}
