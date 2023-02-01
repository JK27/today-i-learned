import {useEffect, useState} from "react";
import supabase from "./supabase";
import "./style.css"




/////////////////////////////////////////////////////////=> APP
function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(function () {
    async function getFacts() {
      setIsLoading(true);

      let query = supabase.from('facts')
        .select('*');

      if (currentCategory !== "all")
        query = query.eq("category", currentCategory)

      const {data: facts, error} = await query
        .order("votesInteresting", {ascending: false});

      if (!error) setFacts(facts);
      else alert("There was an error loading the facts.")
      setIsLoading(false);
    }
    getFacts();
  }, [currentCategory])


  return (
    <>
      {/* ------------------------------------------------- HEADER */}
      <Header showForm={showForm} setShowForm={setShowForm} />

      {/* ---------------------------------- NEW FACT FORM */}
      {showForm ? <NewFactForm setFacts={setFacts} setShowForm={setShowForm} /> : null}


      {/* ------------------------------------------------- MAIN */}
      <main className="main">
        {/* ---------------------------------- CATEGORY FILTERS */}
        <CategoryFilter setCurrentCategory={setCurrentCategory} />

        {/* ---------------------------------- FACTS LIST */}
        {isLoading ? <Loader /> : <FactsList facts={facts} setFacts={setFacts} />}

      </main>
    </>
  )
}

//////////////////////////////////////////=> LOADER
function Loader() {
  return <p className="message">Loading...</p>

}

//////////////////////////////////////////=> HEADER
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

//////////////////////////////////////////=> NEW FACT FORM
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
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length

  async function handleSubmit(e) {
    // DOES => Prevents browser from reloading.
    e.preventDefault();

    if (text && isValidHttpUrl(source) && category && text.length <= 200) {
      // FUNCTIONALITY => Create new fact.
      // const newFact = {
      //   id: Math.round(Math.random() * 100000),
      //   text,
      //   source,
      //   category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };

      // FUNCTIONALITY => Upload fact to Supabase and receive the new fact object.
      // DOES => Disables the form fields while the new fact is uploading.
      setIsUploading(true);
      // NOTE => Only need to insert the text, source and category fields. ID and createdIn are automatically generated and the votes always start at 0.
      const {data: newFact, error} = await supabase
        .from("facts")
        .insert([{text, source, category}])
        .select();
      // DOES => Enables the form fields after the new fact is uploaded.
      setIsUploading(false);

      // FUNCTIONALITY => Add new fact to the UI.
      if (!error)
        setFacts((facts) => [newFact[0], ...facts]);


      // DOES => Reset input fields.
      setText("");
      setSource("");
      setCategory("");

      // DOES => Close the form.
      // setShowForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="Share a fact with the world..." value={text} onChange={(e) => setText(e.target.value)} disabled={isUploading} />
      <span>{200 - textLength}</span>
      <input type="text" placeholder="Trustworthy source..." value={source} onChange={(e) => setSource(e.target.value)} disabled={isUploading} />
      <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={isUploading}>
        <option value="">Choose category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>{cat.name.toUpperCase()}</option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>Post</button>
    </form>
  );
}

//////////////////////////////////////////=> CATEGORY FILTERS
function CategoryFilter({setCurrentCategory}) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button className="btn btn-all-categories" onClick={() => setCurrentCategory("all")}>All</button>
        </li>
        {CATEGORIES.map((cat) =>
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{backgroundColor: cat.color}} onClick={() => setCurrentCategory(cat.name)}>
              {cat.name}
            </button>
          </li >
        )}
      </ul>
    </aside>
  );
}

//////////////////////////////////////////=> FACTS LIST
function FactsList({facts, setFacts}) {
  if (facts.length === 0) {return <p className="message">No facts for this category yet. Create the first one!</p>}
  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
      <p>There are {facts.length} facts in the database. Add your own!</p>
    </section>
  );
}

//////////////////////////////////////////=> FACTS
function Fact({fact, setFacts}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed = fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;
  // FUNCTIONALITY => Handle votes.
  async function handleVote(columnName) {
    setIsUpdating(true);
    const {data: updatedFact, error} = await supabase
      .from("facts")
      .update({[columnName]: fact[columnName] + 1})
      .eq("id", fact.id)
      .select();
    setIsUpdating(false);

    console.log(updatedFact)
    if (!error) setFacts((facts) => facts.map((f) => f.id === fact.id ? updatedFact[0] : f));
  }

  return (
    <li className="fact">
      <p>
        {isDisputed ? <span className="disputed">[⛔ DISPUTED]</span> : null}
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
        <button onClick={() => handleVote("votesInteresting")} disabled={isUpdating}>👍 {fact.votesInteresting}</button>
        <button onClick={() => handleVote("votesMindblowing")} disabled={isUpdating}>🤯 {fact.votesMindblowing}</button>
        <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>⛔ {fact.votesFalse}</button>
      </div>
    </li >
  );
}

export default App;
