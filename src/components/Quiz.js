import React, { useState, useEffect } from "react";

const Quiz = (props) => {
  const [apiResponse, setApiResponse] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [userAnswer, setUserAnswer] = useState([]);
  const [userScore, setUserScore] = useState(-1);

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

  const handleSubmit = (evt) => {
    evt.preventDefault();

    let correctAnswer = 0;
    answer.forEach((ans, index) => {
      if (ans.name === userAnswer[index]) {
        correctAnswer++;
      }
    });
    setUserScore(correctAnswer);
  };

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

  const generateAnswer = (artifacts, index, existingAnswers) => {
    const answer =
      artifacts[index][Math.floor(Math.random() * NUMBER_OF_OPTIONS)];
    if (!existingAnswers.some((element) => element.name === answer.name)) {
      existingAnswers.push(answer);
    } else {
      generateAnswer(artifacts, index, existingAnswers);
    }
  };

  const selectAnswer = (artifacts) => {
    const answerList = [];
    for (let i = 0; i < NUMBER_OF_QUESTIONS; i++) {
      generateAnswer(artifacts, i, answerList);
    }
    return answerList;
  };

  const onUserAnswerSelect = (event, index) => {
    const userAnswersCopy = [...userAnswer];
    userAnswersCopy[index] = event.target.value;

    setUserAnswer(userAnswersCopy);
  };

  const resetUserScore = () => {
    setUserScore(-1);
    document.getElementById("reset-button").reset();
  };

  const renderQuiz = (artifacts, answer) => {
    const quiz = [];

    for (let i = 0; i < NUMBER_OF_QUESTIONS; i++) {
      if (answer[i]) {
        const quizContent = (
          <div className={`question ${i}`}>
            <h3>{`Question ${i + 1}`}</h3>
            <p>
              {`Which artifact has the following 4-piece set effect: 
              ${answer[i][ARTIFACT_FIELDS.FOUR_PIECE]}`}
            </p>
            {artifacts[i].map((artName, index) => {
              return (
                <label key={index}>
                  <input
                    type="radio"
                    value={artName.name}
                    name={`question ${i}`}
                    onChange={(e) => onUserAnswerSelect(e, i)}
                    required={index === 0}
                  />
                  {artName.name}
                </label>
              );
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
      <h1>genshin artifact quiz</h1>
      <form onSubmit={handleSubmit}>
        {artifacts.length > 0
          ? answer.length > 0
            ? renderQuiz(artifacts, answer)
            : ""
          : ""}
        {userScore === -1 ? (
          <>
            <input type="submit" value="Submit" />
            <input type="reset" name="reset" />
          </>
        ) : (
          <input
            type="reset"
            name="reset"
            id="reset-button"
            onClick={resetUserScore}
          />
        )}
      </form>
      {userScore === -1 ? "" : `Score :${userScore}/${NUMBER_OF_QUESTIONS}`}
    </div>
  );
};

export default Quiz;
