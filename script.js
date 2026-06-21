const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");
const educationLevel = document.getElementById("educationLevel");
const customSubjectInput = document.getElementById("customSubject");
const presetSubjectsDiv = document.getElementById("presetSubjects");
const selectedSubjectsDiv = document.getElementById("selectedSubjects");

// ✅ Auto-fill today's date
const today = new Date().toISOString().split("T")[0];
document.getElementById("startDate").value = today;

// ✅ Preset subjects per education level
const presets = {
    school_1_5: ["English", "Maths", "EVS", "Hindi", "GK"],
    school_6_8: ["English", "Maths", "Science", "Social Studies", "Hindi", "Sanskrit"],
    school_9_10: ["English", "Maths", "Science", "Social Science", "Hindi", "IT"],
    school_11_12_science: ["Physics", "Chemistry", "Maths", "Biology", "English", "CS"],
    school_11_12_commerce: ["Accountancy", "Business Studies", "Economics", "English", "Maths"],
    school_11_12_arts: ["History", "Geography", "Political Science", "English", "Sociology", "Psychology"],
    college_btech: ["DSA", "Java", "Maths", "Physics", "Software Engineering", "DBMS", "OS", "Networks"],
    college_bsc: ["Physics", "Chemistry", "Maths", "Biology", "English"],
    college_bcom: ["Accountancy", "Economics", "Business Law", "Taxation", "Finance"],
    college_ba: ["History", "Political Science", "Sociology", "English", "Psychology"],
    college_mba: ["Marketing", "Finance", "HR", "Operations", "Business Strategy", "Economics"],
    college_mtech: ["Advanced Algorithms", "Machine Learning", "Research Methodology", "VLSI", "Networks"],
    college_msc: ["Advanced Maths", "Physics", "Chemistry", "Research Methods", "Statistics"],
    college_law: ["Constitutional Law", "Criminal Law", "Civil Law", "Contract Law", "Legal Writing"],
    college_medical: ["Anatomy", "Physiology", "Biochemistry", "Pharmacology", "Pathology"],
    exam_jee: ["Physics", "Chemistry", "Maths"],
    exam_neet: ["Physics", "Chemistry", "Biology"],
    exam_upsc: ["History", "Geography", "Polity", "Economics", "Science & Tech", "Current Affairs", "Ethics"],
    exam_gate: ["Engineering Maths", "General Aptitude", "DSA", "OS", "DBMS", "Networks", "Algorithms"],
    exam_cat: ["Quantitative Aptitude", "Verbal Ability", "Logical Reasoning", "Data Interpretation"],
    exam_nda: ["Maths", "Physics", "Chemistry", "English", "History", "Geography", "Current Affairs"],
    exam_clat: ["English", "Current Affairs", "Legal Reasoning", "Logical Reasoning", "Quantitative Techniques"],
    exam_ssc: ["English", "General Awareness", "Quantitative Aptitude", "Reasoning"],
};

let selectedSubjects = [];

// ✅ When education level changes, show preset subjects
educationLevel.addEventListener("change", () => {
    const level = educationLevel.value;
    selectedSubjects = [];
    presetSubjectsDiv.innerHTML = "";
    selectedSubjectsDiv.innerHTML = "";

    if (!level || !presets[level]) return;

    presets[level].forEach(subject => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "preset-btn";
        btn.textContent = subject;
        btn.onclick = () => togglePreset(btn, subject);
        presetSubjectsDiv.appendChild(btn);
    });
});

// ✅ Toggle preset subject on/off
function togglePreset(btn, subject) {
    if (selectedSubjects.includes(subject)) {
        selectedSubjects = selectedSubjects.filter(s => s !== subject);
        btn.classList.remove("active");
    } else {
        selectedSubjects.push(subject);
        btn.classList.add("active");
    }
    renderSelectedSubjects();
}

// ✅ Add custom subject on Enter
customSubjectInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        const val = customSubjectInput.value.trim();
        if (val && !selectedSubjects.includes(val)) {
            selectedSubjects.push(val);
            renderSelectedSubjects();
        }
        customSubjectInput.value = "";
    }
});

// ✅ Render selected subjects as tags
function renderSelectedSubjects() {
    selectedSubjectsDiv.innerHTML = "";
    selectedSubjects.forEach(subject => {
        const tag = document.createElement("span");
        tag.className = "subject-tag";
        tag.innerHTML = `${subject} <span class="remove-tag" onclick="removeSubject('${subject}')">✕</span>`;
        selectedSubjectsDiv.appendChild(tag);
    });
}

// ✅ Remove subject tag
function removeSubject(subject) {
    selectedSubjects = selectedSubjects.filter(s => s !== subject);
    document.querySelectorAll(".preset-btn").forEach(btn => {
        if (btn.textContent === subject) btn.classList.remove("active");
    });
    renderSelectedSubjects();
}

// ✅ Generate button
generateBtn.addEventListener("click", async () => {

    const level = educationLevel.value;
    const startDate = document.getElementById("startDate").value;
    const examDate = document.getElementById("examDate").value;
    const studyHours = document.getElementById("studyHours").value;

    if (!level) {
        result.innerText = "Please select your education level.";
        return;
    }

    if (selectedSubjects.length === 0) {
        result.innerText = "Please select or add at least one subject.";
        return;
    }

    if (!startDate || !examDate || !studyHours) {
        result.innerText = "Please fill all fields.";
        return;
    }

    if (startDate >= examDate) {
        result.innerText = "Exam date must be after start date!";
        return;
    }

    result.innerHTML = "⏳ Generating your study plan...";

    const levelText = educationLevel.options[educationLevel.selectedIndex].text;

    const prompt = `You are an expert academic mentor.

Create a personalized study plan for a ${levelText} student.

Subjects: ${selectedSubjects.join(", ")}
Start Date: ${startDate}
Exam Date: ${examDate}
Study Hours Per Day: ${studyHours}

Instructions:
- Create a day-by-day study plan ONLY from ${startDate} to ${examDate}.
- Do NOT include any dates before ${startDate}.
- - On the exam day (${examDate}), write the date as a heading with ## then on the next line write "🎯 Exam Day - Best of luck! You've got this!" — no study tasks, no topics.
- For each day, just mention which topics or chapters to study — NO timings, NO clock times.
- Use **bold** for subject names and important topics.
- Start each day with ## followed by the date.
- List topics as bullet points using - for each topic.
- Prioritize difficult subjects first.
- Include revision days closer to the exam date.
- Keep it simple and practical for a ${levelText} student.`;

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
                .replace(/^### (.*$)/gm, "<h4>$1</h4>")
                .replace(/^## (.*$)/gm, "<h3>$1</h3>")
                .replace(/^# (.*$)/gm, "<h2>$1</h2>")
                .replace(/^\* (.*$)/gm, "<li>$1</li>")
                .replace(/^• (.*$)/gm, "<li>$1</li>")
                .replace(/^- (.*$)/gm, "<li>$1</li>")
                .replace(/(\d{4}-\d{2}-\d{2})/g, '<span class="date-label">$1</span>')
                .replace(/\n/g, "<br>");
        } else {
            result.innerText = "Error: " + JSON.stringify(data);
        }

    } catch (error) {
        result.innerText = "Something went wrong. Check console.";
        console.error(error);
    }
});