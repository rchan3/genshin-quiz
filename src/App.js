import React, { useState, useEffect } from "react";
import "./App.css";

const EXCLUDED_ARTIFACTS = [
  "prayers-for-illumination",
  "prayers-for-destiny",
  "prayers-for-wisdom",
  "prayers-to-springtime",
  "prayers-to-the-firmament",
];

const NUMBER_OF_QUESTIONS = 10;

const NUMBER_OF_OPTIONS = 4;

const ARTIFACT_FIELDS = {
  FOUR_PIECE: "4-piece_bonus",
};

const App = () => {
  const [apiResponse, setApiResponse] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [answer, setAnswer] = useState([]);

  const callArtifactsAPI = async () => {
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

    const quizList = [];

    for (let i = 0; i < NUMBER_OF_QUESTIONS; i++) {
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
        // TODO how to handle if one of the API calls fails?
      }
      quizList.push(randoQuiz);
    }
    return quizList;
  };

  const selectAnswer = (artifacts) => {
    const answerList = [];
    for (let i = 0; i < NUMBER_OF_QUESTIONS; i++) {
      const answer =
        artifacts[i][Math.floor(Math.random() * NUMBER_OF_OPTIONS)];
      if (!answerList.includes(answer)) {
        answerList.push(answer);
      }
    }
    return answerList;
  };

  const renderQuiz = (artifacts, answer) => {
    const quiz = [];

    for (let i = 0; i < NUMBER_OF_QUESTIONS; i++) {
      if (answer[i] === undefined || artifacts[i] === undefined) {
      } else {
        console.log(artifacts[i]);
        const quizContent = (
          <div>
            <p>
              which artifact has this set effect:
              {answer[i][ARTIFACT_FIELDS.FOUR_PIECE]}
            </p>
            {artifacts[i].map((artName, x) => {
              return <p key={x}>{artName.name}</p>;
            })}
          </div>
        );

        quiz.push(quizContent);
      }
    }
    return quiz;
  };

  useEffect(() => {
    const start = async () => {
      if (apiResponse.length === 0) {
        await callArtifactsAPI();
      } else {
        const artifacts = await artifactQuiz();
        const answer = selectAnswer(artifacts);
        setArtifacts(artifacts);
        setAnswer(answer);
        renderQuiz(artifacts, answer);
      }
    };
    start();
  }, [apiResponse]);

  return (
    <div className="App">
      <header className="App-header">genshin artifact quiz</header>
      {artifacts.length > 0 ? renderQuiz(artifacts, answer) : ""}
    </div>
  );
};

export default App;
