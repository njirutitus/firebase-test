import { getQuestions } from "./Firestore";

export function AssessmentQuestions() {
  const stream = getQuestions("qualificationAnswers");
  stream((answers) => {
    // filter the qualification answer as per the stored session id which is meant to identify the session or logged in user
    answers = answers.filter(
      (answer) => answer.id === sessionStorage.getItem("id")
    );
    fetchAssessmentQuestions(answers);
  });

  function fetchAssessmentQuestions(answers) {
    answers.forEach((answer) => {
      // fetch qualification questions to get assessment questions
      const assesStream = getQuestions("qualificationQuestions");
      assesStream((ques) => {
        let assForm =
          '<form id="ass_form" method="post"><h3>Assessment Questions</h3>'; //initialize assessment form

        // filter qualification questions by the answer key
        Object.entries(answer).forEach(([key, value]) => {
          const newques = ques.filter((que) => que.id === key);
          let assQues = [];

          // extract the options object from the qualification question
          newques.forEach((newQue) => {
            const ques = newQue.options;
            Object.entries(ques).forEach(([k, v]) => {
              if (k === value) {
                assQues.push(v);
              }
            });
          });

          // append each qualification ques to assessment form
          assForm += displayAssessmentQuestions(assQues);
        });

        // finalise assessment form and attach to root element
        assForm += '<input type="submit" value="submit"></form>';
        document.getElementById("root").innerHTML = assForm;

        //destroy session id
        sessionStorage.removeItem("id");
      });
    });
  }

  function displayAssessmentQuestions(questions) {
    let form = "";

    // questions categories
    questions.forEach((question) => {
      form += `<h4>${question.category}</h4>`;
      const assessmentQuestions = question.assessmentQuestion;
      assessmentQuestions.forEach((question) => {
        form += `<div><label>${question}</label><input type="range" min="0" max="10" value="0"/></div>`;
      });
    });
    return form;
  }
}
