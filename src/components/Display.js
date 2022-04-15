export function display(questions) {
  let table =
    "<table><thead><tr><th>Question Category</th><th>Question Id</th><th>Question Law Name</th><th>Question Law statements</th><th>Question</th></tr></thead><tbody>";
  for (const question in questions) {
    table += "<tr><td>";
    const value = questions[question];
    table += value.quescat + "</td><td>" + value.quesid + "</td>";
    const laws = value.queslaws;
    let count = 0;
    for (const k in laws) {
      if (count > 0) {
        table += "</tr><tr><td></td><td></td>";
        table +=
          "<td>" +
          laws[k].lawname +
          "</td><td>" +
          laws[k].statements +
          "</td><td></td></tr>";
        continue;
      }
      table +=
        "<td>" +
        laws[k].lawname +
        "</td><td>" +
        laws[k].statements +
        "</td>" +
        "<td>" +
        value.question +
        "</td></tr>";
      count++;
    }
    //   break; // stop after first iteration
  }

  document.getElementById("root").innerHTML = table + "</tbody></table>";
}
