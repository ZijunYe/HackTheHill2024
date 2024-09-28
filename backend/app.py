import os
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
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

print(os.environ.get("OPENAI_API_KEY"))

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
- **Index**: The index of task.
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
- **Index**: The index of task.
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
        # Extract the raw content from the response
        print(response)
        raw_content = response.choices[0].message.content
        
        # Remove any markdown formatting (if necessary)
        cleaned_content = raw_content.strip('```json').strip('```').strip()
        
        # Parse the cleaned content as JSON
        roadmap = json.loads(cleaned_content)
        document_data = {
            'Goal': goal,
            'DifficultyLevel': difficulty_level,
            'Age': age,
            'Gender': gender,
            'TimeSpan': time_span,
            'roadmap': roadmap  # Include the generated roadmap
        }
        # Store the JSON directly into Firestore
        doc_ref = db.collection('Roadmap').document('map')
        doc_ref.set(document_data)
        
        return jsonify({'roadmap': roadmap}), 200
    except json.JSONDecodeError as e:
        logger.error(f"JSON decoding error: {str(e)}")
        return jsonify({'error': 'Failed to parse the OpenAI response as JSON.'}), 500
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
import json
import logging

logger = logging.getLogger(__name__)

def update_roadmap(existing_roadmap, index, feedback):
    # Validate the index
    if index < 1 or index > len(existing_roadmap):
        raise ValueError('Invalid index provided.')  # Raise an exception

    # Get feedback and goal from the request
    data = request.get_json()
    feedback = data.get('Feedback')
    goal = data.get('Goal')
    
    logger.info('Updating roadmap for goal: %s based on feedback: %s', goal, feedback)

    # Prepare the user prompt for OpenAI
    user_prompt = f"""
The user has an existing roadmap to achieve the goal: **{goal}**.
Here is the current roadmap:

{json.dumps(existing_roadmap, indent=2)}

The user provided the following feedback to improve or modify the roadmap:
- **Feedback**: {feedback}

Please update the roadmap based on the feedback. Generate the updated roadmap in JSON format, ensuring the same structure as the existing roadmap:

- **Task**: A specific action or activity for the updated roadmap.
- **Days**: The number of days allocated to complete the task.
- **Index**: The index of task.
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
        cleaned_content = raw_content.strip('```json').strip('```').strip()
        print("\nCLEANED CONTENT")
        print(cleaned_content)
        # Parse the cleaned JSON content
        new_roadmap_part = json.loads(cleaned_content)

        # Combine the existing roadmap with the new tasks
        updated_roadmap = existing_roadmap[:index-1] + new_roadmap_part + existing_roadmap[index-1:]
        print(updated_roadmap)
        # Return the updated roadmap
        return updated_roadmap  
    except json.JSONDecodeError as e:
        logger.error(f"JSON decoding error: {str(e)}")
        raise ValueError('Failed to parse the OpenAI response as JSON.')  # Raise an exception
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise  # Raise the error for handling elsewhere

def delete_message_after_json(input_string):
    index = input_string.find(']')
    if index != -1:
        return input_string[:index + 1]
    return input_string

@app.route('/regenerate_dataset', methods=['POST'])
def regenerate_dataset():
    data = request.get_json()
    index = data.get("Index")
    feedback = data.get("Feedback")
    
    try:
        # Check if data is valid
        if not data:
            logger.error("No data provided")
            return jsonify({'error': 'No data provided'}), 400

        # Retrieve the existing roadmap
        doc_ref = db.collection('Roadmap').document('map')
        doc = doc_ref.get()
        logger.info("Document reference: %s", doc_ref)
        existing_data = doc.to_dict().get('data', [])

        if not existing_data:
            return jsonify({'error': 'Roadmap data not found'}), 404

        # Ensure the index is within bounds
        if index < 1 or index > len(existing_data):
            return jsonify({'error': 'Index out of bounds'}), 400

        # Update the roadmap with the feedback
        updated_roadmap = update_roadmap(existing_data, index, feedback)
        
        # Print the updated roadmap (for debugging)
        print("Updated Roadmap:", json.dumps(updated_roadmap, indent=2))

        # Update the document with the modified data
        doc_ref.set({'data': updated_roadmap})

        # Return the updated roadmap along with the success message
        return jsonify({'message': 'Roadmap updated successfully', 'updated_data': updated_roadmap}), 200

    except Exception as e:
        logger.error("Error updating roadmap: %s", str(e))
        return jsonify({'error': str(e)}), 500

    
@app.route('/change_dataset', methods=['POST'])
def change_dataset():
    data = request.get_json()
    index = data["Index"]
    print(data["Index"])
    print("\n")

    
    try:
        # Retrieve the JSON data from the request
        data = request.get_json()
        logger.info("Received data: %s", data)
        
        # Check if data is valid
        if not data:
            logger.error("No data provided")
            return jsonify({'error': 'No data provided'}), 400

        # Retrieve the existing roadmap
        doc_ref = db.collection('Roadmap').document('map')
        doc = doc_ref.get()
        logger.info("Document reference: %s", doc_ref)
        logger.info("document: %s", doc)
        existing_data = doc.to_dict().get('data', [])
        existing_data[index-1] = data
        
        # Update the document with the modified data
        doc_ref.set({'data': existing_data})  
        #doc_ref.set(data)  
        logger.info("Roadmap updated successfully")

        return jsonify({'message': 'Roadmap updated successfully'}), 200

    except Exception as e:
        logger.error("Error updating roadmap: %s", str(e))
        return jsonify({'error': str(e)}), 500
        
if __name__ == '__main__':
    app.run(debug=True)
