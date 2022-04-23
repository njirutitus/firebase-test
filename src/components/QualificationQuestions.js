export function DisplayQualificationQuestions(questions) {
  let form = '<form id="form" action="" method="post">';
  questions.forEach((question) => {
    form += "<div>";
    form +=
      '<label for="' + question.id + '">' + question.question + "</label>";
    form += '<input type="radio" name="' + question.id + '" />Yes';
    form += '<input type="radio" name="' + question.id + '" />NO';
    form += "</div>";
  });
  document.getElementById("root").innerHTML =
    form + '<input type="submit" value="submit"</form>';
}
