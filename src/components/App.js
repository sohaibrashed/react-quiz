import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Error from "./Error";
import Loader from "./Loader";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import { useQuiz } from "../contexts/QuizContext";

export default function App() {
  const { questions, dispatch, status, index } = useQuiz();

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      <Header />
      <Main className="main">
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen numQuestions={numQuestions} />}
        {status === "active" && (
          <>
            <Progress
              numQuestions={numQuestions}
              maxPossiblePoints={maxPossiblePoints}
            />
            <Question question={questions[index]} />
            <Footer>
              <Timer />
              <NextButton numQuestions={numQuestions} />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen maxPossiblePoints={maxPossiblePoints} />
        )}
      </Main>
    </div>
  );
}
