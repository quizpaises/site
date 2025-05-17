const quizData = {
  easy: [
    { question: "¿Cuál es la capital de Francia?", options: ["París", "Madrid", "Berlín", "Roma"], answer: "París" },
    { question: "¿En qué continente está Egipto?", options: ["África", "Asia", "Europa", "América"], answer: "África" },
    { question: "¿Cuál es el idioma oficial de Brasil?", options: ["Portugués", "Español", "Inglés", "Francés"], answer: "Portugués" }
  ],
  medium: [
    { question: "¿Cuál es la capital de Canadá?", options: ["Toronto", "Ottawa", "Montreal", "Vancouver"], answer: "Ottawa" },
    { question: "¿Qué país tiene la bandera con una hoja de arce roja?", options: ["Canadá", "Suiza", "Austria", "Japón"], answer: "Canadá" }
  ],
  hard: [
    { question: "¿Cuál es la capital de Kirguistán?", options: ["Bishkek", "Astana", "Tashkent", "Dushanbe"], answer: "Bishkek" }
  ]
};

let currentLevel = null;
let currentQuestion = 0;
let score = 0;
let answered = false;
let shuffledQuestions = [];

const startBtn = document.getElementById("start-btn");
const levelRadios = document.querySelectorAll('input[name="level"]');
const levelSection = document.getElementById("level-section");
const quizSection = document.getElementById("quiz-section");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const resultEl = document.getElementById("result");
const submitBtn = document.getElementById("submit-btn");
const progressBar = document.getElementById("progress-bar");

levelRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    startBtn.disabled = false;
  });
});

startBtn.addEventListener("click", () => {
  currentLevel = document.querySelector('input[name="level"]:checked').value;
  shuffledQuestions = shuffleArray(quizData[currentLevel]);
  currentQuestion = 0;
  score = 0;
  levelSection.style.display = "none";
  quizSection.style.display = "block";
  loadQuestion();
  updateProgress();
});

function shuffleArray(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function loadQuestion() {
  answered = false;
  submitBtn.disabled = true;
  submitBtn.textContent = "Enviar respuesta";
  resultEl.textContent = "";
  resultEl.className = "";
  const q = shuffledQuestions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  q.options.forEach(opt => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="radio" name="answer" id="opt-${opt}" value="${opt}">
      <label for="opt-${opt}">${opt}</label>
    `;
    optionsEl.appendChild(li);
  });

  const radios = optionsEl.querySelectorAll('input[name="answer"]');
  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      submitBtn.disabled = false;
    });
  });

  updateProgress();
}

submitBtn.addEventListener("click", () => {
  if (answered) {
    currentQuestion++;
    if (currentQuestion >= shuffledQuestions.length) {
      showFinalScore();
    } else {
      loadQuestion();
    }
    return;
  }

  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) return;

  const answer = selected.value;
  const correct = shuffledQuestions[currentQuestion].answer;
  answered = true;

  if (answer === correct) {
    resultEl.textContent = "¡Correcto!";
    resultEl.className = "result correct";
    score++;
  } else {
    resultEl.textContent = `Incorrecto. La respuesta era: ${correct}`;
    resultEl.className = "result incorrect";
  }

  submitBtn.textContent = "Siguiente pregunta";
});

function showFinalScore() {
  questionEl.textContent = `¡Quiz terminado! Puntos: ${score} de ${shuffledQuestions.length}`;
  optionsEl.innerHTML = "";
  resultEl.textContent = "";
  submitBtn.textContent = "Reiniciar";
  submitBtn.onclick = () => location.reload();
}

function updateProgress() {
  const progress = (currentQuestion / shuffledQuestions.length) * 100;
  progressBar.style.width = `${progress}%`;
}
