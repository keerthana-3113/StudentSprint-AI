const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");

generateBtn.addEventListener("click", () => {

    const subjects = document.getElementById("subjects").value;
    const examDate = document.getElementById("examDate").value;
    const studyHours = document.getElementById("studyHours").value;

    result.innerText =
        `Subjects: ${subjects}

Exam Date: ${examDate}

Study Hours Per Day: ${studyHours}`;
});