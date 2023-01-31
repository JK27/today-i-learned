import {useEffect, useState} from "react";
import supabase from "./supabase";
import "./style.css"

/*
function Counter() {
  const [count, setCount] = useState(0)

  return <div>
    <span style={{fontSize: "40px"}}>{count}</span>
    <button className="btn btn-large" onClick={() => setCount(count + 1)}>+1</button>
  </div>
}
*/

/////////////////////////////////////////////////////////// APP
function App() {
  const [showForm, setShowForm] = useState(false)
  const [facts, setFacts] = useState([])

  useEffect(function () {
    async function getFacts() {
      const {data: facts, error} = await supabase
        .from('facts')
        .select('*');
      setFacts(facts);
    }
    getFacts();
  }, [])


  return (
    <>
      {/* ------------------------------------------------- HEADER */}
      <Header showForm={showForm} setShowForm={setShowForm} />

      {/* ---------------------------------- NEW FACT FORM */}
      {showForm ? <NewFactForm setFacts={setFacts} setShowForm={setShowForm} /> : null}


      {/* ------------------------------------------------- MAIN */}
      <main className="main">
        {/* ---------------------------------- CATEGORY FILTERS */}
        <CategoryFilter />

        {/* ---------------------------------- FACTS LIST */}
        <FactsList facts={facts} />
      </main>
    </>
  )
}

//////////////////////////////////////////// HEADER

function Header({showForm, setShowForm}) {
  const appTitle = "Today I Learned"

  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="Today I Learned logo" />
        <h1>{appTitle}</h1>
      </div>
      <button className="btn btn-large btn-open" onClick={() => setShowForm((show) => !show)}>{showForm ? "Close" : "Share a Fact"}</button>
    </header>
  )
}
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

//////////////////////////////////////////// NEW FACT FORM
function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({setFacts, setShowForm}) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const textLength = text.length

  function handleSubmit(e) {
    // DOES => Prevents browser from reloading.
    e.preventDefault();

    if (text && isValidHttpUrl(source) && category && text.length <= 200) {
      // FUNCTIONALITY => Create new fact.
      const newFact = {
        id: Math.round(Math.random() * 100000),
        text,
        source,
        category,
        votesInteresting: 0,
        votesMindblowing: 0,
        votesFalse: 0,
        createdIn: new Date().getFullYear(),
      };
      // FUNCTIONALITY => Adds new fact to the UI.
      setFacts((facts) => [newFact, ...facts]);

      // DOES => Reset input fields.
      setText("");
      setSource("");
      setCategory("");

      // DOES => Close the form.
      setShowForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="Share a fact with the world..." value={text} onChange={(e) => setText(e.target.value)} />
      <span>{200 - textLength}</span>
      <input type="text" placeholder="Trustworthy source..." value={source} onChange={(e) => setSource(e.target.value)} />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Choose category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>{cat.name.toUpperCase()}</option>
        ))}
      </select>
      <button className="btn btn-large">Post</button>
    </form>
  );
}

//////////////////////////////////////////// CATEGORY FILTERS
function CategoryFilter() {
  return (
    <aside>
      <ul>
        <li className="category">
          <button className="btn btn-all-categories">All</button>
        </li>
        {CATEGORIES.map((cat) =>
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{backgroundColor: cat.color}}>
              {cat.name}
            </button>
          </li >
        )}
      </ul>
    </aside>
  );
}

//////////////////////////////////////////// FACTS LIST
function FactsList({facts}) {

  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} />
        ))}
      </ul>
      <p>There are {facts.length} facts in the database.</p>
    </section>
  );
}

//////////////////////////////////////////// FACTS
function Fact({fact}) {
  return (
    <li className="fact">
      <p>
        {fact.text}
        <a
          className="source"
          rel="noreferrer"
          href={fact.source}
          target="_blank"
        >(Source)</a>
      </p>
      <span className="tag" style={{backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category).color}}
      >{fact.category}</span>
      <div className="vote-buttons">
        <button>👍 {fact.votesInteresting}</button>
        <button>🤯 {fact.votesMindblowing}</button>
        <button>⛔ {fact.votesFalse}</button>
      </div>
    </li>
  );
}

export default App;
