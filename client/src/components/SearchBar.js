import React, {useContext} from "react";
import { T, useT } from "react-polyglot-hooks";

import SearchContect from "../context/Search/search";
import { navigate } from "hookrouter";

const SearchBar = () => {
  const { q, setQ } = useContext(SearchContect);
  const t = useT

  const handleSubmit = async (q) => {
    navigate('/audio-library')
    setQ(q)
  };

  const reset = () => {
    setQ("")
  };

  return (
    <form id="searchbar">
      <label htmlFor="q">
        {" "}
        <T phrase="searchInAudioLibrary" />
      </label>
      <input
        id="q"
        name="q"
        type="text"
        value={q}
        onChange={(e) => {
          handleSubmit(e.target.value);
        }}
      />
      <button onClick={()=> reset()} className="btn btn--icon">
        {q ? (<span className="material-icons">clear</span>): (<span className="material-icons">search</span>)}
      </button>
    </form>
  );
};

export default SearchBar;
