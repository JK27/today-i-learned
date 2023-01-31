const btn = document.querySelector(".btn-open");
const form = document.querySelector(".fact-form");
const factsList = document.querySelector(".facts-list");

const CATEGORIES = [
  {name: "technology", color: "#3b82f6"},
  {name: "science", color: "#16a34a"},
  {name: "finance", color: "#ef4444"},
  {name: "society", color: "#eab308"},
  {name: "entertainment", color: "#db2777"},
  {name: "health", color: "#14b8a6"},
  {name: "history", color: "#f97316"},
  {name: "news", color: "#8b5cf6"},
];

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

// FUNCTIONALITY => Create DOM elements: Render facts in list.
factsList.innerHTML = "";

// FUNCTIONALITY => Load data from Supabase.
loadFacts();
async function loadFacts() {
  const res = await fetch("https://hzzoczkjeszfdsjlptsf.supabase.co/rest/v1/facts", {
    headers: {
      apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6em9jemtqZXN6ZmRzamxwdHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ2NjYzNTcsImV4cCI6MTk5MDI0MjM1N30._f1s3OZRSuD2GmI3WOKSCI9kIYkJ8NRlbPF_BpDI7lE",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6em9jemtqZXN6ZmRzamxwdHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ2NjYzNTcsImV4cCI6MTk5MDI0MjM1N30._f1s3OZRSuD2GmI3WOKSCI9kIYkJ8NRlbPF_BpDI7lE"
    },
  });
  const data = await res.json();
  console.log(data)
  // const filteredData = data.filter((fact) => fact.category === "society")
  createFactsList(data)
}

function createFactsList(dataArray) {
  const htmlArray = dataArray.map((fact) => `<li class="fact">
  <p>
  ${fact.text}
  <a
  class="source"
  href="${fact.source}"
  target="_blank"
  >(Source)</a>
  </p>
  <span class="tag" style="background-color: ${CATEGORIES.find((cat) => cat.name === fact.category).color}">${fact.category}</span>
  </li>`
  );
  console.log(htmlArray);


  const html = htmlArray.join("");
  factsList.insertAdjacentHTML("afterbegin", html);
}


// FUNCTIONALITY => Toggle form visibility.
btn.addEventListener("click", function () {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    btn.textContent = "Close";
  } else {
    form.classList.add("hidden");
    btn.textContent = "Share a fact";
  }
})