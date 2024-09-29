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

def calculate_reward_points():
    try:
        # Retrieve the existing roadmap document
        doc_ref = db.collection('Roadmap').document('map')
        doc = doc_ref.get()
        
        # Ensure the document exists
        if not doc.exists:
            logger.warning("No roadmap document found to calculate reward points.")
            return 0  # Return 0 if no document is found

        # Get the roadmap data from the document
        roadmap_data = doc.to_dict().get('roadmap', [])

        # Calculate reward points by summing up points of finished tasks
        total_reward_points = sum(task['Points'] for task in roadmap_data if task.get('Status') == 'finished')

        # Store the total reward points in Firestore
        doc_ref.update({'RewardPoints': total_reward_points})
        
        logger.info(f"Total reward points calculated and updated: {total_reward_points}")
        return total_reward_points

    except Exception as e:
        logger.error(f"Error calculating reward points: {str(e)}")
        return 0  # Return 0 in case of any errors

@app.route('/api/generate_roadmap', methods=['POST'])
def generate_roadmap():
    data = request.get_json()
    goal = data.get('Goal')
    name = data.get('Name')
    difficulty_level = data.get('DifficultyLevel')
    time_span = data.get('TimeSpan')

    # Validate inputs
    if not all([name, goal, difficulty_level, time_span]):
        return jsonify({'error': 'All fields (Name, Goal, DifficultyLevel, Age, Gender, TimeSpan) are required.'}), 400

    logger.info('Generating roadmap for goal: %s', goal)

    # Prepare the user prompt
    user_prompt = f"""
Please generate a personalized roadmap to help me achieve my goal.

- **Name**: {name}
- **Goal**: {goal}
- **DifficultyLevel**: {difficulty_level}
- **TimeSpan**: {time_span}

Generate a roadmap in JSON format, where the JSON is an array and each element contains the following fields:

- **Name**: Name of the user.
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

- Ensure that each task includes a "Points" field on a scale from 0 to 10 along with all the other attributes.
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
        # print(response)
        raw_content = response.choices[0].message.content
        
        # Remove any markdown formatting (if necessary)
        raw_content = response.choices[0].message.content.strip()
        
        # Clean the content to remove any unwanted formatting or markdown
        cleaned_content = raw_content.replace('```json','').replace('```','')
        start_idx = cleaned_content.find('[')
        end_idx = cleaned_content.rfind(']') + 1
        cleaned_content = cleaned_content[start_idx:end_idx]        # Parse the cleaned content as JSON
        roadmap = json.loads(cleaned_content)
        for task in roadmap:
            if 'Points' not in task:
                logger.warning("One of the tasks is missing the Points field. Setting a default value.")
                task['Points'] = 5  # Default to 5 points if missing
                
        for task in roadmap:
            task["Status"] = "undone"
        current_task = roadmap[0]["Index"] if roadmap else None

        document_data = {
            'Name': name,
            'Goal': goal,
            'DifficultyLevel': difficulty_level,
            'TimeSpan': time_span,
            'roadmap': roadmap,  # Include the generated roadmap
            'RewardPoints': 0,
            "CurrentTask": current_task
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
    
@app.route('/api/update_roadmap', methods=['POST'])
def update_roadmap():
    # Get the feedback from the request body
    data = request.get_json()
    feedback = data.get('Feedback')
    
    # Validate input
    if not feedback:
        return jsonify({'error': 'Feedback is required.'}), 400

    logger.info('Updating roadmap based on feedback: %s', feedback)
    
    try:
        # Retrieve the existing roadmap and user details from Firestore
        doc_ref = db.collection('Roadmap').document('map')
        doc = doc_ref.get()
        if not doc.exists:
            return jsonify({'error': 'No roadmap found in Firestore.'}), 404

        existing_data = doc.to_dict()
        existing_roadmap = existing_data.get('roadmap', [])
        name = existing_data.get('Name')
        goal = existing_data.get('Goal')
        difficulty_level = existing_data.get('DifficultyLevel')
        time_span = existing_data.get('TimeSpan')

        # Validate that all necessary information is available
        if not all([name, goal, difficulty_level, time_span, existing_roadmap]):
            return jsonify({'error': 'Incomplete user data or roadmap in Firestore.'}), 400

        user_prompt = f"""
        The user has an existing roadmap to achieve the goal: **{goal}**.
        Here is the current roadmap:

        {json.dumps(existing_roadmap, indent=2)}

        The user provided the following feedback to improve or modify the roadmap:\n- **Feedback**: {feedback}

        Please generate a personalized roadmap to help me achieve my goal.
        
        - **Name**: {name}
        - **Goal**: {goal}
        - **DifficultyLevel**: {difficulty_level}
        - **TimeSpan**: {time_span}


        Please update the roadmap based on the feedback. Generate the updated roadmap in JSON format, ensuring the same structure and keep the exisitng task from and generate the future task based on the last :

        - **Name**: Name of the user.
        - **Task**: A specific action or activity for the updated roadmap.
        - **Days**: The number of days allocated to complete the task.
        - **Index**: The index of task.
        - **Description**: A detailed explanation of the task and how it contributes to the goal.
        - **ResourceLinks**: An array of relevant resource links to assist in completing the task.

        Ensure that the roadmap is well-structured and aligns with the feedback provided by the user.
        """

        # Call OpenAI API to adjust the roadmap based on the feedback
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ],
            temperature=1,
            max_tokens=4096,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
        )

        # Extract the content of the response
        raw_content = response.choices[0].message.content.strip()
        
        # Clean the content to remove any unwanted formatting or markdown
        cleaned_content = raw_content.replace('```json','').replace('```','')
        start_idx = cleaned_content.find('[')
        end_idx = cleaned_content.rfind(']') + 1
        cleaned_content = cleaned_content[start_idx:end_idx]
        updated_roadmap = json.loads(cleaned_content)
        for task in updated_roadmap:
            task['Status'] = 'undone'
        current_task = updated_roadmap[0] if updated_roadmap else None
        print("update_roadmap", update_roadmap)
        # Update the existing Firestore document with the new roadmap
        doc_ref.update({'roadmap': updated_roadmap})
        calculate_reward_points()
        # Return the updated roadmap in the response
        return jsonify({'updated_roadmap': updated_roadmap}), 200
    
    except json.JSONDecodeError as e:
        logger.error(f"JSON decoding error: {str(e)}")
        return jsonify({'error': 'Failed to parse the OpenAI response as JSON.'}), 500
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/adjust_subsequent_tasks', methods=['POST'])
def adjust_subsequent_tasks():
    data = request.get_json()
    task_index = data.get('Index')

    doc_ref = db.collection('Roadmap').document('map')
    doc = doc_ref.get()
    logger.info("Document reference: %s", doc_ref)
    logger.info("document: %s", doc)
    existing_data = doc.to_dict().get('roadmap', [])
    print("exisitng data", existing_data)
    updated_task = existing_data[:task_index]
    print("updating task: ", updated_task )
    # Infer the new difficulty level based on the user's modification
    inferred_difficulty = infer_difficulty_level(existing_data, updated_task)
    print("inferred_difficulty:", inferred_difficulty)
    # Extract the tasks that need to be adjusted
    subsequent_tasks = existing_data[task_index + 1:]
    roadmap=""
    # Prepare a prompt to re-generate subsequent tasks
    user_prompt = f"""
Please adjust the following roadmap to align with the updated task at index {task_index}.

- **Updated Task**: {updated_task}
- **Inferred DifficultyLevel**: {inferred_difficulty}

Here are the tasks that need adjustment:

{subsequent_tasks}

Generate the adjusted tasks in JSON format, ensuring:

- The tasks follow logically from the updated task.
- They align with the inferred difficulty level.
- The overall progression towards the goal remains smooth.
"""

    # Call OpenAI API to adjust the tasks
    try:
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
        )

        # Parse the response
        raw_content = response.choices[0].message.content
        cleaned_content = raw_content.replace('```json','').replace('```','')
        start_idx = cleaned_content.find('[')
        end_idx = cleaned_content.rfind(']') + 1
        cleaned_content = cleaned_content[start_idx:end_idx]

        print("Cleaned content:", cleaned_content)

        # Parse the cleaned JSON content
        new_tasks = json.loads(cleaned_content)
        # Update the roadmap with the new tasks
        roadmap = new_tasks

    except json.JSONDecodeError as e:
        logger.error(f"JSON decoding error: {str(e)}")
        # Handle the error as needed
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        # Handle the error as needed
        calculate_reward_points()

    return roadmap


def infer_difficulty_level(original_task, updated_task):
    analysis_prompt = f"""
I have an original task and an updated task:

- **Original Task**: {original_task}
- **Updated Task**: {updated_task}

Based on the changes, infer the user's preferred difficulty level among ['Easy', 'Medium', 'Hard'].

Provide just the difficulty level.
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an assistant that infers difficulty levels based on task modifications."},
                {"role": "user", "content": analysis_prompt}
            ],
            temperature=0,
            max_tokens=10,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
        )

        # Extract the inferred difficulty level
        inferred_difficulty = response.choices[0].message.content.strip()

        # Validate the inferred difficulty level
        if inferred_difficulty not in ['Easy', 'Medium', 'Hard']:
            inferred_difficulty = 'Medium'  # Default to Medium if invalid

    except Exception as e:
        logger.error(f"Error inferring difficulty level: {str(e)}")
        inferred_difficulty = 'Medium'  # Default to Medium on error

    return inferred_difficulty

@app.route('/api/update_task_status', methods=['PATCH'])
def update_task_status():
    try:
        # Retrieve the request data
        data = request.get_json()
        task_index = data.get('Index')

        if task_index is None:
            return jsonify({'error': 'Task index is required.'}), 400

        # Retrieve the existing roadmap document
        doc_ref = db.collection('Roadmap').document('map')
        doc = doc_ref.get()
        
        if not doc.exists:
            return jsonify({'error': 'Roadmap document not found.'}), 404

        roadmap_data = doc.to_dict().get('roadmap', [])
        current_task = doc.to_dict().get('CurrentTask')

        # Update the status of the task at the specified index
        task = roadmap_data[task_index]  # Since the index is 1-based
        if task['Status'] == 'finished':
            task['Status'] = 'undone'
        elif task['Status'] == 'undone':
            task['Status'] = 'finished'
        current_task = current_task + 1
        # Check if the task index is within the bounds of the roadmap
        if current_task < 1 or current_task > len(roadmap_data):
            return jsonify({'error': 'Task index is out of bounds.'}), 400
        
        # Update the roadmap document in Firestore
        doc_ref.update({'roadmap': roadmap_data, 'CurrentTask': current_task})
        calculate_reward_points()
        return jsonify({'message': f'Task at index {task_index} updated to finished successfully', 'updated_task': task}), 200

    except Exception as e:
        logger.error(f"Error updating task status: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/get_roadmap', methods=['GET'])
def get_roadmap():
    try:
        # Retrieve the roadmap document from Firestore
        doc_ref = db.collection('Roadmap').document('map')
        doc = doc_ref.get()

        # Check if the document exists
        if not doc.exists:
            return jsonify({'error': 'No roadmap found in Firestore.'}), 404

        # Get the roadmap data as a dictionary
        roadmap_data = doc.to_dict()

        # Return the roadmap data as a JSON response
        return jsonify({'roadmap_data': roadmap_data}), 200

    except Exception as e:
        logger.error(f"Error retrieving roadmap data: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
