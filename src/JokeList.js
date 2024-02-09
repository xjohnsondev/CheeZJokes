import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

const JokeList = () => {
  const NUM_JOKES_TO_GET = 5;
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //get jokes on start
  useEffect(() => {
    getJokes();
  }, []);

  // retrieve jokes from API
  async function getJokes() {
    try {
      // load jokes one at a time, adding not-yet-seen jokes
      let jokes = [];
      let seenJokes = new Set();

      while (jokes.length < NUM_JOKES_TO_GET) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        let { ...joke } = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          jokes.push({ ...joke, votes: 0 });
        } else {
          console.log("duplicate found!");
        }
      }
      setJokes((prevJokes) => [...prevJokes, ...jokes]);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  // empty joke list, set to loading state, and then call getJokes
  const generateNewJokes = () => {
    setIsLoading(true);
    getJokes();
  };

  // change vote for this id by delta (+1 or -1)
  function vote(id, delta) {
    setJokes((prevJokes) =>
      prevJokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  }
  
  // sort by upvote/ downvote differential
  let sortedJokes = jokes.sort((a, b) => b.votes - a.votes);
  
  // render: either loading spinner or list of sorted jokes
  return (
    <div>
      {isLoading ? (
        <div className="loading">
          <i className="fas fa-4x fa-spinner fa-spin" />
        </div>
      ) : (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={generateNewJokes}>
            Get New Jokes
          </button>

          {sortedJokes.map((j) => (
            <Joke
              text={j.joke}
              key={j.id}
              id={j.id}
              votes={j.votes}
              vote={vote}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JokeList;
