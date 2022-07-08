let account;

const candidates = {
  Cat: 1,
  Dog: 2,
};

const getAccounts = () => {
  $.getJSON("/api/contract/accounts", (data) => {
    console.log(data);
    account = data.account;
  });
};

const totalVotesFor = (ids) => {
  $.post("/api/contract/total", { ids }, (data) => {
    console.log(data);
    for (const name of Object.keys(data)) {
      $(`td#\\3${name}`).html(data[name]["voteCount"]);
      $(`#img${name}`).attr("src", `/api/file/cat/${data[name]["image"]}`);
    }
  });
};

const voteForCandidate = () => {
  const id = Number($("#candidate-select").val());
  $.post("/api/contract/vote", { id, from: account }, (data) => {
    console.log(data);
    document.location.reload();
  });
};

$(document).ready(async () => {
  getAccounts();
  totalVotesFor(Object.values(candidates));
});
