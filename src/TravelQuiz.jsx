import React, { useState, useEffect } from 'react';
import './TravelQuiz.css';
import { Volume2 } from 'lucide-react';

// 各ディレクトリから問題データを読み込み
const maleCoursesContext = require.context('./data/courses/male', false, /\.js$/);
const femaleCoursesContext = require.context('./data/courses/female', false, /\.js$/);

const maleCourses = maleCoursesContext.keys().map((key) => {
  const courseModule = maleCoursesContext(key);
  return { 
    id: 'male_' + key,
    title: courseModule.title,
    quizData: courseModule.quizData
  };
});

const femaleCourses = femaleCoursesContext.keys().map((key) => {
  const courseModule = femaleCoursesContext(key);
  return { 
    id: 'female_' + key,
    title: courseModule.title,
    quizData: courseModule.quizData
  };
});

// メインコンポーネント
export default function TravelQuiz() {
  // 性別選択用の状態（"male", "female", "none"）
  const [selectedGender, setSelectedGender] = useState("none");

  // 選択された性別に応じてコースを決定
  const courses =
    selectedGender === "male"
      ? maleCourses
      : selectedGender === "female"
      ? femaleCourses
      : [...maleCourses, ...femaleCourses];

  // 以下は既存の状態管理
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // クイズ開始処理：選択したコースの問題をシャッフルして10問出題
  const startQuiz = (course) => {
    const shuffled = shuffleArray([...course.quizData]);
    const selected = shuffled.slice(0, 10);
    const finalQuestions = selected.map((q) => ({
      ...q,
      options: shuffleArray([...q.options]),
    }));
    setQuestions(finalQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setAnswerHistory([]);
    setSelectedOption(null);
    setIsRevealed(false);
    setIsCorrect(null);
    setStartTime(Date.now());
    setEndTime(null);
    setHasStarted(true);
  };

  // クイズ再スタート（同じコース）
  const restartQuiz = () => {
    if (selectedCourse) startQuiz(selectedCourse);
  };

  // コース選択画面へ戻る（性別選択は保持）
  const backToCourseSelection = () => {
    setHasStarted(false);
    setSelectedCourse(null);
    setQuestions([]);
    setScore(0);
    setShowResult(false);
    setAnswerHistory([]);
    setSelectedOption(null);
    setIsRevealed(false);
    setIsCorrect(null);
    setStartTime(null);
    setEndTime(null);
  };

  // 音声読み上げ（タイ語）
  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('音声読み上げがサポートされていません');
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'th-TH';
    window.speechSynthesis.speak(utter);
  };

  // 回答チェック
  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    const currentQ = questions[currentQuestionIndex];
    const correct = selectedOption === currentQ.correctAnswer;
    setIsCorrect(correct);
    setIsRevealed(true);
    setAnswerHistory((prev) => [
      ...prev,
      {
        question: currentQ.question,
        roman: currentQ.roman,
        selected: selectedOption,
        correctAnswer: currentQ.correctAnswer,
        isCorrect: correct,
      },
    ]);
    if (correct) {
      setScore((prev) => prev + 1);
      setTimeout(() => {
        goToNextQuestion();
      }, 1000);
    }
  };

  // 次の問題へ
  const goToNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedOption(null);
      setIsRevealed(false);
      setIsCorrect(null);
    } else {
      setShowResult(true);
      setEndTime(Date.now());
    }
  };

  // キーボード操作による回答選択
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isRevealed && hasStarted && !showResult && questions.length) {
        if (["1", "2", "3", "4"].includes(e.key)) {
          const index = parseInt(e.key) - 1;
          const currentQ = questions[currentQuestionIndex];
          if (currentQ && currentQ.options[index]) {
            setSelectedOption(currentQ.options[index]);
          }
        } else if (e.key === 'Enter') {
          handleCheckAnswer();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [questions, currentQuestionIndex, isRevealed, selectedOption, hasStarted, showResult]);

  // ① コース選択画面（ラジオボタンで性別選択）
  if (!hasStarted) {
    return (
      <div className="quiz-container">
        <h1 className="quiz-title">タイ語クイズ コース選択</h1>
        <p className="quiz-text">以下のコースから選んでください：</p>
        {/* 性別選択ラジオボタン */}
        <div className="gender-selection">
          <p>言葉の選択:</p>
          <label>
            <input
              type="radio"
              name="gender"
              value="none"
              checked={selectedGender === "none"}
              onChange={(e) => setSelectedGender(e.target.value)}
            />
            指定なし
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={selectedGender === "male"}
              onChange={(e) => setSelectedGender(e.target.value)}
            />
            男性言葉
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={selectedGender === "female"}
              onChange={(e) => setSelectedGender(e.target.value)}
            />
            女性言葉
          </label>
        </div>
        <div className="course-list">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => {
                setSelectedCourse(course);
                startQuiz(course);
              }}
              className="course-button"
            >
              {course.title}
            </button>
          ))}
        </div>
      </div>
    );
  }


  // ② クイズデータの読み込み待ち状態
  if (!questions.length && hasStarted && !showResult) {
    return (
      <div className="quiz-container">
        <h1 className="quiz-title">Loading Quiz...</h1>
      </div>
    );
  }

  // ③ 結果画面
  if (showResult) {
    const timeTaken = endTime && startTime ? ((endTime - startTime) / 1000).toFixed(2) : 0;
    return (
      <div className="quiz-container">
        <h1 className="quiz-title">結果</h1>
        <p className="quiz-score">
          あなたの正解数は {score} / {questions.length} です！
        </p>
        <p className="quiz-time">所要時間: {timeTaken} 秒</p>
        <div className="history-container">
          <h2 className="history-title">回答履歴</h2>
          <ul className="history-list">
            {answerHistory.map((item, idx) => (
              <li key={idx} className="history-item">
                <p className="history-question">
                  Q{idx + 1}. {item.question}
                  {item.roman && (
                    <span className="history-roman"> {item.roman}</span>
                  )}
                </p>
                <p>
                  あなたの回答:{" "}
                  <span className={item.isCorrect ? "answer-correct" : "answer-wrong"}>
                    {item.selected}
                  </span>
                </p>
                {!item.isCorrect && (
                  <p>
                    正解:{" "}
                    <span className="answer-correct">
                      {item.correctAnswer}
                    </span>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="button-group">
          <button onClick={restartQuiz} className="restart-button">
            リスタート
          </button>
          <button onClick={backToCourseSelection} className="back-button">
            コース選択へ
          </button>
        </div>
      </div>
    );
  }

  // ④ クイズ画面
  const currentQ = questions[currentQuestionIndex];
  return (
    <div className="quiz-container">
      <h1 className="quiz-title">{selectedCourse.title} クイズ</h1>
      <div className="quiz-card">
        <div className="quiz-question-wrapper">
          <p className="quiz-question">{currentQ.question}</p>
          <button
            onClick={() => handleSpeak(currentQ.question)}
            className="speak-button"
            title="音声再生"
          >
            <Volume2 className="speak-icon" />
          </button>
        </div>
        {currentQ.roman && (
          <p className="quiz-roman">({currentQ.roman})</p>
        )}
        <div className="options-container">
          {currentQ.options.map((option, idx) => {
            const isSelected = option === selectedOption;
            return (
              <button
                key={idx}
                onClick={() => !isRevealed && setSelectedOption(option)}
                className={`option-button ${isSelected ? "option-button-selected" : ""}`}
              >
                {idx + 1}. {option}
              </button>
            );
          })}
        </div>
        {!isRevealed && (
          <button
            onClick={handleCheckAnswer}
            disabled={selectedOption === null}
            className={`check-button ${selectedOption === null ? "disabled" : ""}`}
          >
            回答
          </button>
        )}
        {isRevealed && (
          <div className="reveal-container">
            {isCorrect ? (
              <p className="correct-message">正解です！</p>
            ) : (
              <div>
                <p className="wrong-message">不正解です...</p>
                <p className="correct-answer">
                  正解は「{currentQ.correctAnswer}」です。
                </p>
                <button onClick={goToNextQuestion} className="next-button">
                  次へ
                </button>
              </div>
            )}
          </div>
        )}
        <p className="progress-text">
          Question {currentQuestionIndex + 1} / {questions.length}
        </p>
      </div>
    </div>
  );
}

// 配列シャッフル関数
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
