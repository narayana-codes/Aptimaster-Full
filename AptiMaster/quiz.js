const user = JSON.parse(localStorage.getItem("user"));

if(user){
    document.querySelector(".profile-box h3").innerText = user.name;
    document.getElementById("avatar").innerText =
user.name.charAt(0).toUpperCase();
}


const category = localStorage.getItem("quizCategory");
const selectedLevel = localStorage.getItem("quizLevel");

console.log("Category =", category);
console.log("Level =", selectedLevel);
let questions = [];

async function loadQuestionsFromBackend() {

    const response = await fetch(
        `https://aptimaster-full-e9fy.vercel.app/questions?category=${category}&level=${selectedLevel}`
    );

    questions = await response.json();
console.log("Questions:", questions);
console.log("Length:", questions.length);
    userAnswers = new Array(questions.length).fill(null);

    loadQuestion();
}




let currentQuestion = 0;
let userAnswers = new Array(questions.length).fill(null);

/* HTML Elements */

const qno = document.getElementById("qno");
const questionText = document.getElementById("question-text");

const opt1 = document.getElementById("opt1");
const opt2 = document.getElementById("opt2");
const opt3 = document.getElementById("opt3");
const opt4 = document.getElementById("opt4");

const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const reviewBtn = document.getElementById("review-btn");
const clearBtn = document.getElementById("clear-btn");
const submitBtn = document.getElementById("submitBtn");
const paletteButtons = document.querySelectorAll(".q-btn");

/* SAVE ANSWER */
function saveAnswer() {

    const radios =
        document.querySelectorAll('input[name="answer"]');

    radios.forEach((radio, index) => {

        if (radio.checked) {
            userAnswers[currentQuestion] = index;
        }

    });

}
localStorage.setItem("startTime", Date.now());
/* LOAD QUESTION */

function loadQuestion() {

    const q = questions[currentQuestion];

    qno.innerText = currentQuestion + 1;

    questionText.innerText = q.question;

    opt1.innerText = q.options[0];
    opt2.innerText = q.options[1];
    opt3.innerText = q.options[2];
    opt4.innerText = q.options[3];

paletteButtons.forEach((btn, index) => {

    btn.classList.remove("active");
    btn.classList.remove("answered");

    if (userAnswers[index] !== null) {
        btn.classList.add("answered");
    }

    if (index === currentQuestion) {
        btn.classList.add("active");
    }

});

if (paletteButtons[currentQuestion]) {
    paletteButtons[currentQuestion].classList.add("active");
}

    const radios =
        document.querySelectorAll('input[name="answer"]');

    radios.forEach(radio => {
        radio.checked = false;
    });

    if (userAnswers[currentQuestion] !== null) {
        radios[userAnswers[currentQuestion]].checked = true;
    }

}

/* INITIAL LOAD */

loadQuestionsFromBackend();

/* PALETTE BUTTONS */

paletteButtons.forEach((button, index) => {

    button.addEventListener("click", () => {

        saveAnswer();

        if (index < questions.length) {

            currentQuestion = index;

            loadQuestion();
        }

    });

});

/* NEXT BUTTON */

nextBtn.addEventListener("click", () => {

    saveAnswer();

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        loadQuestion();

    }

});

/* PREVIOUS BUTTON */

prevBtn.addEventListener("click", () => {

    saveAnswer();

    if (currentQuestion > 0) {

        currentQuestion--;

        loadQuestion();

    }

});

/* CLEAR RESPONSE */

clearBtn.addEventListener("click", () => {

    const radios =
        document.querySelectorAll('input[name="answer"]');

    radios.forEach(radio => {
        radio.checked = false;
    });

    userAnswers[currentQuestion] = null;
    paletteButtons[currentQuestion].classList.remove("answered");

});

/* MARK FOR REVIEW */

reviewBtn.addEventListener("click", () => {

      paletteButtons[currentQuestion].classList.remove("active");
    paletteButtons[currentQuestion].classList.remove("answered");

    paletteButtons[currentQuestion].classList.add("review");

});

/* TIMER */

let totalSeconds =  600;

const timerElement =
    document.getElementById("time");

function updateTimer() {

    let minutes =
        Math.floor(totalSeconds / 60);

    let seconds =
        totalSeconds % 60;

    timerElement.innerText =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");

    if (totalSeconds > 0) {

        totalSeconds--;
    }

    else {

    clearInterval(timer);

    localStorage.setItem(
        "totalQuestions",
        questions.length
    );

    localStorage.setItem(
        "answeredQuestions",
        userAnswers.filter(
            answer => answer !== null
        ).length
    );

    alert("Time Over! Test Submitted.");
    window.location.href = "result.html";
}

}

updateTimer();

const timer =
 setInterval(updateTimer, 1000);
  submitBtn.addEventListener("click", () => {

    saveAnswer();

    document.getElementById("submitModal").style.display = "flex";

});


document.getElementById("cancelSubmit").addEventListener("click", () => {

    document.getElementById("submitModal").style.display = "none";

});


document.getElementById("confirmSubmit").addEventListener("click", async () => {

    document.getElementById("submitModal").style.display = "none";

    saveAnswer();

    console.log("Before submit");

    const response = await fetch("https://aptimaster-full-e9fy.vercel.app/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            answers: userAnswers,
            category: category,
            level: selectedLevel
        })
    });

    const result = await response.json();

    let score = result.score;

    localStorage.setItem(
        "answeredQuestions",
        userAnswers.filter(answer => answer !== null).length
    );

    localStorage.setItem("score", score);
    localStorage.setItem("totalQuestions", questions.length);

    localStorage.setItem(
        "questions",
        JSON.stringify(questions)
    );

    localStorage.setItem(
        "userAnswers",
        JSON.stringify(userAnswers)
    );

    localStorage.setItem("endTime", Date.now());

    window.location.href = "result.html";

});