const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");

// ✅ Auto-fill today's date in Start Date
const today = new Date().toISOString().split("T")[0];
document.getElementById("startDate").value = today;

generateBtn.addEventListener("click", async () => {

    const subjects = document.getElementById("subjects").value;
    const startDate = document.getElementById("startDate").value;  // ✅ new
    const examDate = document.getElementById("examDate").value;
    const studyHours = document.getElementById("studyHours").value;

    if (!subjects || !startDate || !examDate || !studyHours) {
        result.innerText = "Please fill all fields.";
        return;
    }

    // ✅ Check start date is before exam date
    if (startDate >= examDate) {
        result.innerText = "Exam date must be after start date!";
        return;
    }

    result.innerHTML = "Generating your study plan...";

    const prompt = `You are an expert academic mentor.

Create a personalized study plan.

Subjects: ${subjects}
Start Date: ${startDate}
Exam Date: ${examDate}
Study Hours Per Day: ${studyHours}

Instructions:
- Create a day-by-day study plan ONLY from ${startDate} to ${examDate}.
- Do NOT include any dates before ${startDate}.
- On the exam day (${examDate}), ONLY write "Exam Day - Best of luck! 🎯" — no study tasks, no hours, no schedule.
- Prioritize difficult subjects.
- Include revision sessions closer to exam date.
- Include short breaks.
- Keep the plan practical for students.`;

    try {
        const response = await fetch("http://localhost:3000/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [{ role: "user", content: prompt }]
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]?.message?.content) {
            const rawText = data.choices[0].message.content;
            result.innerHTML = rawText
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/^## (.*$)/gm, "<h3>$1</h3>")
                .replace(/^- (.*$)/gm, "• $1<br>")
                .replace(/\n/g, "<br>");
        } else {
            result.innerText = "Error: " + JSON.stringify(data);
        }

    } catch (error) {
        result.innerText = "Something went wrong. Check console.";
        console.error(error);
    }
});