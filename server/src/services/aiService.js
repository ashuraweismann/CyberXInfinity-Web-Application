import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateLearningSuggestion = async ({
  labTitle,
  score,
  totalQuestions,
  percentage,
  results,
}) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const incorrectResults = results.filter(
    (result) => !result.isCorrect
  );

  const correctResults = results.filter(
    (result) => result.isCorrect
  );

  const weakTopics = [
    ...new Set(
      incorrectResults.map(
        (result) => result.topic
      )
    ),
  ];

  const strongTopics = [
    ...new Set(
      correctResults.map(
        (result) => result.topic
      )
    ),
  ];

  const performanceData = {
    lab: labTitle,
    score,
    totalQuestions,
    percentage,
    strongTopics,
    weakTopics,
    incorrectQuestions: incorrectResults.map(
      (result) => ({
        topic: result.topic,
        question: result.question,
        explanation: result.explanation,
      })
    ),
  };

  const completion =
    await groq.chat.completions.create({
      model:
        process.env.GROQ_MODEL ||
        "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content: `
You are CyberXInfinity's cybersecurity learning assistant.

Your job is to analyze a student's quiz performance and
provide personalized educational guidance.

Rules:
- Do not change or calculate the student's score.
- Do not invent quiz results.
- Do not provide offensive security instructions.
- Focus on learning and understanding.
- Identify weak topics from the supplied data.
- Recommend what the student should review.
- Keep the language suitable for a university cybersecurity student.
- Be encouraging but honest.
- Keep the response concise.
          `,
        },

        {
          role: "user",
          content: `
Analyze this student's quiz performance:

${JSON.stringify(
  performanceData,
  null,
  2
)}

Provide:
1. A short overall summary.
2. Topics the student performed well on.
3. Topics that need improvement.
4. Three practical study recommendations.
5. One suggested next learning step.
          `,
        },
      ],

      response_format: {
        type: "json_schema",

        json_schema: {
          name: "cyberxfinity_learning_feedback",

          strict: true,

          schema: {
            type: "object",

            properties: {
              summary: {
                type: "string",
              },

              strengths: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              weakTopics: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              recommendations: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              nextStep: {
                type: "string",
              },
            },

            required: [
              "summary",
              "strengths",
              "weakTopics",
              "recommendations",
              "nextStep",
            ],

            additionalProperties: false,
          },
        },
      },

      temperature: 0.4,
    });

  const content =
    completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error(
      "Groq returned an empty response."
    );
  }

  return JSON.parse(content);
};

export default generateLearningSuggestion;