from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
  model="gpt-4o",
  messages=[
    {
      "role": "system",
      "content": [
        {
          "type": "text",
          "text": "You are an AI assistant for a self-improvement application. Your task is to generate a personalized roadmap to help users achieve their goals. When provided with the following user inputs:\n\nGoal: What the user wants to achieve.\nDifficultyLevel: The desired difficulty level (e.g., easy, medium, hard).\nAge: The user's age.\nGender: The user's gender.\nTimeSpan: The total time span available to achieve the goal (in days).\nPlease generate a roadmap in JSON format. The JSON should be an array where each element contains the following fields:\n\nTask: A specific action or activity the user should perform.\nDays: The number of days allocated to complete the task.\nDescription: A detailed explanation of the task and how it contributes to the user's goal.\nResourceLinks: An array of relevant resource links to assist the user in completing the task.\nInstructions:\n\nEnsure that the tasks are tailored to the user's age and gender.\nAlign the difficulty of the tasks with the specified difficulty level.\nThe sum of the days for all tasks should not exceed the provided time span.\nProvide clear and concise descriptions.\nInclude reputable and relevant resource links.\nExample Output:\n[\n  {\n    \"Task\": \"Start a daily meditation practice\",\n    \"Days\": 7,\n    \"Description\": \"Begin with 5 minutes of meditation each morning to improve mindfulness.\",\n    \"ResourceLinks\": [\"https://www.example.com/meditation-guide\"]\n  },\n  {\n    \"Task\": \"Incorporate healthy eating habits\",\n    \"Days\": 14,\n    \"Description\": \"Add more fruits and vegetables to your meals to boost overall health.\",\n    \"ResourceLinks\": [\"https://www.example.com/healthy-eating\"]\n  }\n]"
        }
      ]
    },
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": """
          Please generate a personalized roadmap to help me achieve my goal.- **Goal**: {Goal}
        - **DifficultyLevel**: {DifficultyLevel}
        - **Age**: {Age}
        - **Gender**: {Gender}
        - **TimeSpan**: {TimeSpan}

        Generate a roadmap in JSON format, where the JSON is an array and each element contains the following fields:

        - **Task**: A specific action or activity I should perform.
        - **Days**: The number of days allocated to complete the task.
        - **Description**: A detailed explanation of the task and how it contributes to my goal.
        - **ResourceLinks**: An array of relevant resource links to assist me in completing the task.

        **Instructions:**

        - Ensure that the tasks are tailored to my age and gender.
        - Align the difficulty of the tasks with the specified difficulty level.
        - The sum of the days for all tasks should not exceed the provided time span.
        - Provide clear and concise descriptions.
        - Include reputable and relevant resource links.
        """
        }
      ]
    },
  ],
  temperature=1,
  max_tokens=2048,
  top_p=1,
  frequency_penalty=0,
  presence_penalty=0,
  response_format={
    "type": "text"
  }
)