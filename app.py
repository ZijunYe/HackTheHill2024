import os
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define OpenAI Client Class
class OpenAIClient:
    def __init__(self):
        self.model = "gpt-3.5-turbo"

    def generate_response(self, prompt, temperature=0.7, max_tokens=1500):
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=temperature,
                max_tokens=max_tokens,
            )
            return response['choices'][0]['message']['content'].strip()
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise

# Instantiate OpenAI Client
client = OpenAIClient()

@app.route('/generate_roadmap', methods=['POST'])
def generate_roadmap():
    data = request.get_json()
    name = data.get('name')
    skills = data.get('skills')

    if not name or not skills:
        return jsonify({'error': 'Name and skills are required.'}), 400

    logger.info('Generating roadmap for user: %s', name)

    # Prepare the prompt
    prompt = f"""
    As a personal development coach, create a self-improvement roadmap for a user named {name} who wants to improve in the following areas:

    {skills}

    The roadmap should be an array of JSON objects, each representing a roadblock. Each roadblock should include:
    - "title": A brief title of the roadblock.
    - "description": A detailed explanation of the roadblock.
    - "to_do_items": An array of tasks the user should complete to overcome the roadblock.

    Provide reasonable and actionable items. The JSON should be parsable and not include any additional text outside of the JSON array.
    """

    try:
        # Use the OpenAI client to generate a response
        assistant_reply = client.generate_response(prompt)
        roadblocks = json.loads(assistant_reply)

        return jsonify({'roadmap': roadblocks}), 200
    except json.JSONDecodeError:
        return jsonify({'error': 'Failed to parse the OpenAI response as JSON.'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/feedback', methods=['POST'])
def feedback():
    data = request.get_json()
    feedback_text = data.get('feedback')
    name = data.get('name')
    skills = data.get('skills')

    if not feedback_text or not name or not skills:
        return jsonify({'error': 'Feedback, name, and skills are required.'}), 400

    logger.info('Regenerating roadmap for user: %s based on feedback.', name)

    # Prepare the prompt with feedback
    prompt = f"""
    As a personal development coach, adjust the self-improvement roadmap for a user named {name} based on the following feedback:

    "{feedback_text}"

    The user wants to improve in the following areas:

    {skills}

    The adjusted roadmap should be an array of JSON objects, each representing a roadblock, with:
    - "title": A brief title of the roadblock.
    - "description": A detailed explanation of the roadblock.
    - "to_do_items": An array of tasks the user should complete to overcome the roadblock.

    Provide reasonable and actionable items. The JSON should be parsable and not include any additional text outside of the JSON array.
    """

    try:
        # Use the OpenAI client to generate a response
        assistant_reply = client.generate_response(prompt)
        roadblocks = json.loads(assistant_reply)

        return jsonify({'roadmap': roadblocks}), 200
    except json.JSONDecodeError:
        return jsonify({'error': 'Failed to parse the OpenAI response as JSON.'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
