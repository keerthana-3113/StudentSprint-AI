const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");

const API_KEY = "AQ.Ab8RN6J3XCkEvPzdoyxw1NFr1SpY6oDZKSotqlXdR5ecRejRfQ";

generateBtn.addEventListener("click", async () => {

    const subjects = document.getElementById("subjects").value;
    const examDate = document.getElementById("examDate").value;
    const studyHours = document.getElementById("studyHours").value;

    if (!subjects || !examDate || !studyHours) {
        result.innerText = "Please fill all fields.";
        return;
    }

    result.innerText = "Generating your study plan...";

    const prompt = `
    You are an expert academic mentor.

    Create a personalized study plan.

    Subjects: ${subjects}

    Exam Date: ${examDate}

    Study Hours Per Day: ${studyHours}

    Instructions:
    - Create a day-by-day study plan.
    - Prioritize difficult subjects.
    - Include revision sessions.
    - Include short breaks.
    - Keep the plan practical for students.
    `;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

console.log(data);

if (!data.candidates) {
    result.innerText =
        "Gemini Error: " + JSON.stringify(data);
    return;
}

if (data.candidates) {
    result.innerText =
        data.candidates[0].content.parts[0].text;
} else {
    result.innerText = `
PERSONALIZED STUDY PLAN

Day 1:
• DSA - 2 hrs
• Java - 1 hr
• Maths - 1 hr

Day 2:
• Software Engineering - 2 hrs
• DSA Practice - 2 hrs

Day 3:
• Revision & Mock Test - 4 hrs
`;
}
    } catch (error) {
        result.innerText =
            "Something went wrong. Please try again.";
        console.error(error);
    }
});