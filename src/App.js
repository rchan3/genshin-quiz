import React, { useState, useEffect } from "react";
import "./App.css";

const EXCLUDED_ARTIFACTS = [
  "prayers-for-illumination",
  "prayers-for-destiny",
  "prayers-for-wisdom",
  "prayers-to-springtime",
  "prayers-to-the-firmament",
];

const NUMBER_OF_OPTIONS = 4;

const ARTIFACT_FIELDS = {
  FOUR_PIECE: "4-piece_bonus",
};

const App = () => {
  const [apiResponse, setApiResponse] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [answer, setAnswer] = useState([]);

  const callAPI = async () => {
    const res = await fetch("https://api.genshin.dev/artifacts", {
      method: "GET",
    });
    const jsonData = await res.json();
    setApiResponse(jsonData);
  };

  const artifactQuiz = async () => {
    if (apiResponse.length <= 0) {
      return [];
    }
    const randoSelect = [];
    while (randoSelect.length < NUMBER_OF_OPTIONS) {
      const r = Math.floor(Math.random() * apiResponse.length);
      if (
        !randoSelect.includes(r) &&
        !EXCLUDED_ARTIFACTS.includes(apiResponse[r])
      ) {
        randoSelect.push(r);
      }
    }

    const randoQuiz = [];
    for (let x = 0; x < NUMBER_OF_OPTIONS; x++) {
      const res = await fetch(
        `https://api.genshin.dev/artifacts/${apiResponse[randoSelect[x]]}`,
        { method: "GET" }
      );
      const artifactData = await res.json();
      randoQuiz.push(artifactData);
    }

    // TODO how to handle if one of the API calls fails?
    return randoQuiz;
  };

  const selectAnswer = (artifacts) => {
    const answer = artifacts[Math.floor(Math.random() * NUMBER_OF_OPTIONS)];
    return answer;
  };

  useEffect(() => {
    const start = async () => {
      if (apiResponse.length === 0) {
        await callAPI();
      } else {
        const artifacts = await artifactQuiz();
        const answer = selectAnswer(artifacts);
        setArtifacts(artifacts);
        setAnswer(answer);
      }
    };
    start();
  }, [apiResponse]);
  console.log(artifacts);

  console.log(answer);
  const quizOptions = () => {
    const artList = [];
    artifacts.forEach((art) => {
      const artName = <p>{art.name}</p>;
      artList.push(artName);
    });
    return artList;
  };

  return (
    <div className="App">
      <header className="App-header">genshin artifact quiz</header>
      <p>
        {`Which artifact has this set effect: 
        ${artifacts.length > 0 ? answer[ARTIFACT_FIELDS.FOUR_PIECE] : ""}`}
      </p>
      <div>{artifacts.length > 0 ? quizOptions() : ""}</div>
    </div>
  );
};

export default App;
