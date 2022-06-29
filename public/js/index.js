let account;

const candidates = {
  Rama: "candidate-1",
  Nick: "candidate-2",
  Jose: "candidate-3",
};

const getAccounts = () => {
  $.getJSON("/api/accounts", (data) => {
    console.log(data);
    account = data.account;
  });
};

const totalVotesFor = (names) => {
  $.post("/api/total", { names }, (data) => {
    console.log(data);
    for (const name of Object.keys(data)) {
      $("#" + candidates[name]).html(data[name]);
    }
  });
};

const voteForCandidate = () => {
  const name = $("#candidate").val();
  $.post("/api/vote", { name, from: account }, (data) => {
    console.log(data);
    document.location.reload();
  });
};

$(document).ready(async () => {
  getAccounts();
  totalVotesFor(Object.keys(candidates));
});
