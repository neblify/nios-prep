import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function gradeTestWithAI(test: any, studentAnswers: Record<string, any>) {
    // Construct prompt
    const questionsData = test.questions.map((q: any, i: number) => ({
        id: i,
        text: q.text,
        type: q.type,
        correctAnswer: q.correctAnswer,
        marks: q.marks,
        studentAnswer: studentAnswers[i] || "No Answer",
    }));

    const prompt = `
    You are an expert teacher grading a student's test.
    
    Test Title: ${test.title}
    Subject: ${test.subject}

    Instructions:
    1. Evaluate each answer. For objective questions (MCQ, True/False, Match), check strict correctness. For subjective (Brief Answer, etc), evaluate relevance and accuracy.
    2. Assign marks based on correctness. Partial marks allowed for subjective.
    3. Provide brief feedback for each answer if incorrect or could be improved.
    4. Identify weak areas based on wrong answers.
    5. Provide overall feedback.

    Questions & Answers:
    ${JSON.stringify(questionsData, null, 2)}

    Output Format (JSON strictly):
    {
      "results": [
        {
          "questionIndex": number,
          "isCorrect": boolean,
          "marksObtained": number,
          "feedback": string
        }
      ],
      "totalMarksObtained": number,
      "maxMarks": number,
      "weakAreas": string[],
      "overallFeedback": string
    }
  `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful grading assistant. Respond only in valid JSON." },
                { role: "user", content: prompt },
            ],
            model: "llama-3.3-70b-versatile", // or gemma / mixtral
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error("No content from AI");

        return JSON.parse(content);
    } catch (error) {
        console.error("AI Grading Framework Error:", error);
        // Fallback: Grade objective details manually if AI fails?
        // For now, return error or empty structure
        return null;
    }
}
