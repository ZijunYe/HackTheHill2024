import os
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import openai
from dotenv import load_dotenv

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Replace 'path/to/your/keyfile.json' with the actual path to your downloaded JSON file
cred = credentials.Certificate('firebaseConfig.json')
firebase_admin.initialize_app(cred)

db = firestore.client()


# Load environment variables
load_dotenv()


# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Instantiate OpenAI Client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"),)

# System prompt based on your requirements
SYSTEM_PROMPT = """
You are an AI assistant for a self-improvement application. Your task is to generate a personalized roadmap to help users achieve their goals. When provided with the following user inputs:

- **Goal**: What the user wants to achieve.
- **DifficultyLevel**: The desired difficulty level (e.g., easy, medium, hard).
- **Age**: The user's age.
- **Gender**: The user's gender.
- **TimeSpan**: The total time span available to achieve the goal (in days).

Please generate a roadmap in JSON format. The JSON should be an array where each element contains the following fields:

- **Task**: A specific action or activity the user should perform.
- **Days**: The number of days allocated to complete the task.
- **Description**: A detailed explanation of the task and how it contributes to the user's goal.
- **ResourceLinks**: An array of relevant resource links to assist the user in completing the task.

**Instructions:**

- Ensure that the tasks are tailored to the user's age and gender.
- Align the difficulty of the tasks with the specified difficulty level.
- The sum of the days for all tasks should not exceed the provided time span.
- Provide clear and concise descriptions.
- Include reputable and relevant resource links.
"""

@app.route('/generate_roadmap', methods=['POST'])
def generate_roadmap():
    data = request.get_json()
    goal = data.get('Goal')
    difficulty_level = data.get('DifficultyLevel')
    age = data.get('Age')
    gender = data.get('Gender')
    time_span = data.get('TimeSpan')

    # Validate inputs
    if not all([goal, difficulty_level, age, gender, time_span]):
        return jsonify({'error': 'All fields (Goal, DifficultyLevel, Age, Gender, TimeSpan) are required.'}), 400

    logger.info('Generating roadmap for goal: %s', goal)

    # Prepare the user prompt
    user_prompt = f"""
Please generate a personalized roadmap to help me achieve my goal.

- **Goal**: {goal}
- **DifficultyLevel**: {difficulty_level}
- **Age**: {age}
- **Gender**: {gender}
- **TimeSpan**: {time_span}

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

    try:
            # Use the OpenAI client to generate a response
        response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
            "role": "system",
            "content": [
                {
                "type": "text",
                "text": SYSTEM_PROMPT
                }
            ]
            },
            {
            "role": "user",
            "content": [
                {
                "type": "text",
                "text": user_prompt
                }
            ]
            }
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
        raw_content = response.choices[0].message.content
        # Step 2: Remove the markdown formatting (```json and ```)
        cleaned_content = raw_content.strip('```json').strip('```')
        # print(cleaned_content)
        roadmap = json.loads(cleaned_content)
        print(roadmap)
        doc_ref = db.collection('Roadmap').document('map')
        doc_ref.set({'data': cleaned_content})
        return jsonify({'roadmap': roadmap}), 200
    except json.JSONDecodeError as e:
        logger.error(f"JSON decoding error: {str(e)}")
        return jsonify({'error': 'Failed to parse the OpenAI response as JSON.'}), 500
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/update_roadmap', methods=['POST'])
def update_roadmap():
    data = request.get_json()
    existing_roadmap = data.get('ExistingRoadmap')
    feedback = data.get('Feedback')
    goal = data.get('Goal')

    # Validate inputs
    if not all([existing_roadmap, feedback, goal]):
        return jsonify({'error': 'All fields (ExistingRoadmap, Feedback, Goal) are required.'}), 400

    logger.info('Updating roadmap for goal: %s based on feedback: %s', goal, feedback)

    # Prepare the user prompt
    user_prompt = f"""
The user has an existing roadmap to achieve the goal: **{goal}**.
Here is the current roadmap:

{json.dumps(existing_roadmap, indent=2)}

The user provided the following feedback to improve or modify the roadmap:
- **Feedback**: {feedback}

Please update the roadmap based on the feedback. Generate the updated roadmap in JSON format, ensuring the same structure as the existing roadmap:

- **Task**: A specific action or activity for the updated roadmap.
- **Days**: The number of days allocated to complete the task.
- **Description**: A detailed explanation of the task and how it contributes to the goal.
- **ResourceLinks**: An array of relevant resource links to assist in completing the task.

Ensure that the roadmap is well-structured and aligns with the feedback provided by the user.
"""

    try:
        # Use the OpenAI client to generate a response
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert coach helping users achieve their goals by generating structured roadmaps."
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ],
            temperature=0.7,
            max_tokens=2048,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        # Extract and process the content from OpenAI's response
        raw_content = response.choices[0].message.content
        print(raw_content)
        # Step 2: Remove the markdown formatting (```json and ```)
        cleaned_content = raw_content.strip('```json').strip('```')

        # Parse the cleaned JSON content
        updated_roadmap = json.loads(cleaned_content)

        return jsonify({'updated_roadmap': updated_roadmap}), 200
    except json.JSONDecodeError as e:
        logger.error(f"JSON decoding error: {str(e)}")
        return jsonify({'error': 'Failed to parse the OpenAI response as JSON.'}), 500
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
