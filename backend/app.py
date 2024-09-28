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
        # print(response)
        raw_content = response.choices[0].message.content
        
        # Remove any markdown formatting (if necessary)
        cleaned_content = raw_content.strip('```json').strip('```').strip()
        # Parse the cleaned content as JSON
        roadmap = json.loads(cleaned_content)
        for task in roadmap:
            task["Status"] = "undone"
        
        document_data = {
            'Goal': goal,
            'DifficultyLevel': difficulty_level,
            'Age': age,
            'Gender': gender,
            'TimeSpan': time_span,
            'roadmap': roadmap,  # Include the generated roadmap
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

# def update_roadmap(existing_roadmap, index, feedback, data): # 
#     # Validate the index
#     if index < 1 or index > len(existing_roadmap):
#         raise ValueError('Invalid index provided.')  # Raise an exception

#     # Get feedback and goal from the request
#     feedback = feedback
#     goal = data['Goal']
#     age = data['Age']
#     gender = data['Gender']
#     difficulty_level = data["difficulty_level"] 
#     time_span = data['time_span']  
    
#     logger.info('Updating roadmap for goal: %s based on feedback: %s', goal, feedback)

#     # Prepare the user prompt for OpenAI
#     user_prompt = f"""
# The user has an existing roadmap to achieve the goal: **{goal}**.
# Here is the current roadmap:

# {json.dumps(existing_roadmap, indent=2)}

# The user provided the following feedback to improve or modify the roadmap:\n- **Feedback**: {feedback}

# Please generate a personalized roadmap to help me achieve my goal.

# - **Goal**: {goal}
# - **DifficultyLevel**: {difficulty_level}
# - **Age**: {age}
# - **Gender**: {gender}
# - **TimeSpan**: {time_span}


# Please update the roadmap based on the feedback. Generate the updated roadmap in JSON format, ensuring the same structure and keep the exisitng task from and generate the future task based on the last :

# - **Task**: A specific action or activity for the updated roadmap.
# - **Days**: The number of days allocated to complete the task.
# - **Index**: The index of task.
# - **Description**: A detailed explanation of the task and how it contributes to the goal.
# - **ResourceLinks**: An array of relevant resource links to assist in completing the task.

# Ensure that the roadmap is well-structured and aligns with the feedback provided by the user.
# """

#     try:
#         # Use the OpenAI client to generate a response
#         response = client.chat.completions.create(
#             model="gpt-4o",
#             messages=[
#                 {
#                     "role": "system",
#                     "content": SYSTEM_PROMPT
#                 },
#                 {
#                     "role": "user",
#                     "content": user_prompt
#                 }
#             ],
#              temperature=1,
#         max_tokens=2048,
#         top_p=1,
#         frequency_penalty=0,
#         presence_penalty=0,
#         )
        
#         # Extract and process the content from OpenAI's response
#         raw_content = response.choices[0].message.content
#         cleaned_content = raw_content.strip('```json').strip('```').strip()
#         print("\nCLEANED CONTENT")
#         print(cleaned_content)
#         # Parse the cleaned JSON content
#         new_roadmap_part = json.loads(cleaned_content)

#         # Combine the existing roadmap with the new tasks
#         updated_roadmap = existing_roadmap[:index-1] + new_roadmap_part + existing_roadmap[index-1:]
#         print(updated_roadmap)
#         # Return the updated roadmap
#         return updated_roadmap  
#     except json.JSONDecodeError as e:
#         logger.error(f"JSON decoding error: {str(e)}")
#         raise ValueError('Failed to parse the OpenAI response as JSON.')  # Raise an exception
#     except Exception as e:
#         logger.error(f"Error: {str(e)}")
#         raise  # Raise the error for handling elsewhere

# def delete_message_after_json(input_string):
#     index = input_string.find(']')
#     if index != -1:
#         return input_string[:index + 1]
#     return input_string

# @app.route('/regenerate_dataset', methods=['POST'])
# def regenerate_dataset():
#     data = request.get_json()
#     index = data.get("Index")
#     feedback = data.get("Feedback")
    
#     try:
#         # Check if data is valid
#         if not data:
#             logger.error("No data provided")
#             return jsonify({'error': 'No data provided'}), 400

#         # Retrieve the existing roadmap
#         doc_ref = db.collection('Roadmap').document('map')
#         doc = doc_ref.get()
#         logger.info("Document reference: %s", doc_ref)
#         existing_data = doc.to_dict().get('data', [])

#         if not existing_data:
#             return jsonify({'error': 'Roadmap data not found'}), 404

#         # Ensure the index is within bounds
#         if index < 1 or index > len(existing_data):
#             return jsonify({'error': 'Index out of bounds'}), 400

#         # Update the roadmap with the feedback
#         print(existing_data)
#         updated_roadmap = update_roadmap(existing_data, index, feedback)
        
#         # Print the updated roadmap (for debugging)
#         print("Updated Roadmap:", json.dumps(updated_roadmap, indent=2))

#         # Update the document with the modified data
#         doc_ref.set({'data': updated_roadmap})

#         # Return the updated roadmap along with the success message
#         return jsonify({'message': 'Roadmap updated successfully', 'updated_data': updated_roadmap}), 200

#     except Exception as e:
#         logger.error("Error updating roadmap: %s", str(e))
#         return jsonify({'error': str(e)}), 500

    
# @app.route('/change_dataset', methods=['POST']) 
# def change_dataset():
#     data = request.get_json()
#     index = data["Index"]
#     print(data["Index"])
#     print("\n")

    
#     try:
#         # Retrieve the JSON data from the request
#         data = request.get_json()
#         logger.info("Received data: %s", data)
        
#         # Check if data is valid
#         if not data:
#             logger.error("No data provided")
#             return jsonify({'error': 'No data provided'}), 400

#         # Retrieve the existing roadmap
#         doc_ref = db.collection('Roadmap').document('map')
#         doc = doc_ref.get()
#         logger.info("Document reference: %s", doc_ref)
#         logger.info("document: %s", doc)
#         existing_data = doc.to_dict().get('data', [])
#         existing_data[index-1] = data
        
#         # Update the document with the modified data
#         doc_ref.set({'data': existing_data})  
#         #doc_ref.set(data)  
#         logger.info("Roadmap updated successfully")

#         return jsonify({'message': 'Roadmap updated successfully'}), 200

#     except Exception as e:
#         logger.error("Error updating roadmap: %s", str(e))
#         return jsonify({'error': str(e)}), 500
        

@app.route('/adjust_subsequent_tasks', methods=['POST'])
def adjust_subsequent_tasks():
    data = request.get_json()
    task_index = data.get('task_index')

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
            model="gpt-4",
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

@app.route('/update_task_status', methods=['PATCH'])
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

        # Check if the task index is within the bounds of the roadmap
        if task_index < 1 or task_index > len(roadmap_data):
            return jsonify({'error': 'Task index is out of bounds.'}), 400

        # Update the status of the task at the specified index
        task = roadmap_data[task_index - 1]  # Since the index is 1-based
        task['Status'] = 'finished'

        # Update the roadmap document in Firestore
        doc_ref.update({'roadmap': roadmap_data})

        return jsonify({'message': f'Task at index {task_index} updated to finished successfully', 'updated_task': task}), 200

    except Exception as e:
        logger.error(f"Error updating task status: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
