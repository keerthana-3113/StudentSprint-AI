const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");

generateBtn.addEventListener("click", async () => {

    const subjects = document.getElementById("subjects").value;
    const examDate = document.getElementById("examDate").value;
    const studyHours = document.getElementById("studyHours").value;

    if (!subjects || !examDate || !studyHours) {
        result.innerText = "Please fill all fields.";
        return;
    }

    result.innerHTML = "Generating your study plan...";

    const prompt = `You are an expert academic mentor.

Create a personalized study plan.

Subjects: ${subjects}
Exam Date: ${examDate}
Study Hours Per Day: ${studyHours}

Instructions:
- Create a day-by-day study plan.
- Prioritize difficult subjects.
- Include revision sessions.
- Include short breaks.
- Keep the plan practical for students.`;

    try {
        const response = await fetch("http://localhost:3000/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "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",
                "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
                model: "claude-haiku-4-5-20251001",
                max_tokens: 1024,
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            result.innerText = "API Error: " + (data.error?.message || response.statusText);
            return;
        }

        if (data.content && data.content[0]?.text) {
            const rawText = data.content[0].text;
            result.innerHTML = rawText
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/^## (.*$)/gm, "<h3>$1</h3>")
                .replace(/^- (.*$)/gm, "• $1<br>")
                .replace(/\n/g, "<br>");
        } else {
            result.innerText = "No plan generated. Try again.";
        }

    } catch (error) {
        result.innerText = "Something went wrong. Check console.";
        console.error(error);
    }
});