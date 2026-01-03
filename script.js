document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const startBtn = document.getElementById("start-btn");
  const nextBtn = document.getElementById("next-btn");
  const restartBtn = document.getElementById("restart-btn");
  const welcomeScreen = document.getElementById("welcome-screen");
  const quizContainer = document.getElementById("quiz-container");
  const questionContainer = document.getElementById("question-container");
  const questionText = document.getElementById("question-text");
  const choicesList = document.getElementById("choices-list");
  const resultContainer = document.getElementById("result-container");
  const scoreDisplay = document.getElementById("score-detail");
  const scorePercentage = document.getElementById("score-percentage");
  const correctCount = document.getElementById("correct-count");
  const incorrectCount = document.getElementById("incorrect-count");
  const performanceMessage = document.getElementById("performance-message");
  const progressFill = document.getElementById("progress-fill");
  const currentQuestionNum = document.getElementById("current-question-num");
  const totalQuestionNum = document.getElementById("total-question-num");
  const timerDisplay = document.getElementById("timer");
  const timerWrapper = document.querySelector(".timer-wrapper");
  const feedbackMessage = document.getElementById("feedback-message");
  const scoreRingFill = document.getElementById("score-ring-fill");
  const totalQuestionsDisplay = document.getElementById("total-questions");

  // Quiz Data
  const questions = [
    {
      question: "What is the capital of France?",
      choices: ["Paris", "London", "Berlin", "Madrid"],
      answer: "Paris",
    },
    {
      question: "Which planet is known as the Red Planet?",
      choices: ["Mars", "Venus", "Jupiter", "Saturn"],
      answer: "Mars",
    },
    {
      question: "Who wrote 'Hamlet'?",
      choices: [
        "Charles Dickens",
        "Jane Austen",
        "William Shakespeare",
        "Mark Twain",
      ],
      answer: "William Shakespeare",
    },
    {
      question: "What is the largest ocean on Earth?",
      choices: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      answer: "Pacific Ocean",
    },
    {
      question: "Which programming language is known as the 'language of the web'?",
      choices: ["Python", "JavaScript", "Java", "C++"],
      answer: "JavaScript",
    },
    {
      question: "What is the smallest prime number?",
      choices: ["0", "1", "2", "3"],
      answer: "2",
    },
    {
      question: "Which gas makes up most of Earth's atmosphere?",
      choices: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
      answer: "Nitrogen",
    },
    {
      question: "What is the chemical symbol for gold?",
      choices: ["Go", "Gd", "Au", "Ag"],
      answer: "Au",
    },
    {
      question: "Which continent is the largest by land area?",
      choices: ["Africa", "Asia", "North America", "Europe"],
      answer: "Asia",
    },
    {
      question: "What is the speed of light in vacuum (approximately)?",
      choices: [
        "300,000 km/s",
        "150,000 km/s",
        "450,000 km/s",
        "600,000 km/s",
      ],
      answer: "300,000 km/s",
    },
  ];

  // Quiz State
  let currentQuestionIndex = 0;
  let score = 0;
  let timer = null;
  let timeLeft = 30;
  let selectedAnswer = null;
  let answerSelected = false;

  // Initialize
  totalQuestionsDisplay.textContent = questions.length;
  totalQuestionNum.textContent = questions.length;

  // Event Listeners
  startBtn.addEventListener("click", startQuiz);
  nextBtn.addEventListener("click", handleNextQuestion);
  restartBtn.addEventListener("click", restartQuiz);

  function startQuiz() {
    // Reset state
    currentQuestionIndex = 0;
    score = 0;
    answerSelected = false;
    selectedAnswer = null;

    // Show quiz container
    welcomeScreen.classList.add("hidden");
    quizContainer.classList.remove("hidden");
    resultContainer.classList.add("hidden");

    // Start first question
    showQuestion();
  }

  function showQuestion() {
    // Reset question state
    answerSelected = false;
    selectedAnswer = null;
    timeLeft = 30;
    nextBtn.classList.add("hidden");
    feedbackMessage.classList.remove("show");
    feedbackMessage.className = "feedback-message";

    // Update progress
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    currentQuestionNum.textContent = currentQuestionIndex + 1;

    // Display question
    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;

    // Clear and create choices
    choicesList.innerHTML = "";
    currentQuestion.choices.forEach((choice, index) => {
      const choiceItem = document.createElement("div");
      choiceItem.className = "choice-item";
      choiceItem.textContent = choice;
      choiceItem.dataset.choice = choice;
      choiceItem.addEventListener("click", () => selectAnswer(choice, choiceItem));
      choicesList.appendChild(choiceItem);
    });

    // Start timer
    startTimer();
  }

  function startTimer() {
    timerDisplay.textContent = timeLeft;
    timerWrapper.classList.remove("warning");

    timer = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft;

      // Warning when time is running out
      if (timeLeft <= 10) {
        timerWrapper.classList.add("warning");
      }

      // Time's up
      if (timeLeft <= 0) {
        clearInterval(timer);
        handleTimeUp();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function handleTimeUp() {
    if (!answerSelected) {
      answerSelected = true;
      const correctAnswer = questions[currentQuestionIndex].answer;
      showFeedback(false, correctAnswer);
      disableChoices();
      nextBtn.classList.remove("hidden");
    }
  }

  function selectAnswer(choice, choiceElement) {
    if (answerSelected) return;

    answerSelected = true;
    selectedAnswer = choice;
    stopTimer();

    const correctAnswer = questions[currentQuestionIndex].answer;
    const isCorrect = choice === correctAnswer;

    // Mark selected choice
    choiceElement.classList.add("selected");

    // Disable all choices
    disableChoices();

    // Show correct/incorrect feedback
    setTimeout(() => {
      if (isCorrect) {
        choiceElement.classList.add("correct");
        score++;
        showFeedback(true);
      } else {
        choiceElement.classList.add("incorrect");
        // Highlight correct answer
        const allChoices = choicesList.querySelectorAll(".choice-item");
        allChoices.forEach((item) => {
          if (item.dataset.choice === correctAnswer) {
            item.classList.add("correct");
          }
        });
        showFeedback(false, correctAnswer);
      }

      // Show next button
      nextBtn.classList.remove("hidden");
    }, 300);
  }

  function disableChoices() {
    const allChoices = choicesList.querySelectorAll(".choice-item");
    allChoices.forEach((choice) => {
      choice.classList.add("disabled");
    });
  }

  function showFeedback(isCorrect, correctAnswer = null) {
    feedbackMessage.classList.add("show");
    if (isCorrect) {
      feedbackMessage.textContent = "✓ Correct! Well done!";
      feedbackMessage.classList.add("correct");
    } else {
      feedbackMessage.textContent = `✗ Incorrect. The correct answer is: ${correctAnswer}`;
      feedbackMessage.classList.add("incorrect");
    }
  }

  function handleNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    stopTimer();
    quizContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");

    const percentage = Math.round((score / questions.length) * 100);
    const incorrect = questions.length - score;

    // Update score display
    scoreDisplay.textContent = `${score} out of ${questions.length}`;
    scorePercentage.textContent = percentage;
    correctCount.textContent = score;
    incorrectCount.textContent = incorrect;

    // Animate score ring
    const circumference = 2 * Math.PI * 16;
    const offset = circumference - (percentage / 100) * circumference;
    scoreRingFill.style.strokeDashoffset = offset;

    // Performance message
    let message = "";
    let iconColor = "";
    if (percentage >= 90) {
      message = "🏆 Outstanding! You're a quiz master!";
      iconColor = "#10b981";
    } else if (percentage >= 70) {
      message = "🎉 Great job! You did really well!";
      iconColor = "#667eea";
    } else if (percentage >= 50) {
      message = "👍 Good effort! Keep practicing!";
      iconColor = "#f59e0b";
    } else {
      message = "💪 Keep learning! You'll get better!";
      iconColor = "#ef4444";
    }

    performanceMessage.textContent = message;
    const resultIcon = document.getElementById("result-icon");
    if (resultIcon) {
      resultIcon.style.color = iconColor;
    }
  }

  function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    answerSelected = false;
    selectedAnswer = null;
    stopTimer();

    resultContainer.classList.add("hidden");
    welcomeScreen.classList.remove("hidden");
  }
});
