import dotenv from "dotenv";

import generateLearningSuggestion from "./services/aiService.js";

dotenv.config();

const testAI = async () => {
  try {
    const result =
      await generateLearningSuggestion({
        labTitle: "Web Security",
        score: 7,
        totalQuestions: 10,
        percentage: 70,

        results: [
          {
            questionId: "test1",
            question:
              "Which practice helps prevent SQL injection?",
            selectedOption: 1,
            correctOption: 0,
            isCorrect: false,
            explanation:
              "Parameterized queries help keep data separate from SQL instructions.",
            topic: "SQL Injection",
          },

          {
            questionId: "test2",
            question:
              "What is authentication?",
            selectedOption: 0,
            correctOption: 0,
            isCorrect: true,
            explanation:
              "Authentication verifies identity.",
            topic: "Authentication",
          },
        ],
      });

    console.log(
      JSON.stringify(result, null, 2)
    );
  } catch (error) {
    console.error(
      "AI test failed:",
      error
    );
  }
};

testAI();