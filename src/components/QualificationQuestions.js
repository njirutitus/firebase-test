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
  });

  let form =
    '<form id="qual_form" method="post"><h3>Qualification Questions</h3>';
  questions.forEach((question) => {
    form += "<div>";
    form +=
      '<label for="' + question.id + '">' + question.question + "</label>";
    const options = question.options;
    Object.entries(options).forEach(([key, value]) => {
      if (question.questionType === "radio")
        form += `<input type="${question.questionType}" name="${question.id}" value="${key}"/>${key}`;
      else
        form += `<input type="${question.questionType}" name="${
          question.id + "_" + key
        }" value="${key}"/>${key}`;
    });
    form += "</div>";
  });
  document.getElementById("root").innerHTML =
    form + '<input type="submit" value="submit"></form>';
}
