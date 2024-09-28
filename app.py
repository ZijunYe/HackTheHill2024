from flask import app, json, render_template, request
import openai


@app.route('/feedback', methods=['POST'])
def feedback():
    feedback_text = request.form['feedback']
    name = request.form['name']
    skills = request.form['skills']

    # Incorporate feedback into the prompt
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
        response = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500,
        )

        # Extract and parse the assistant's reply
        assistant_reply = response['choices'][0]['message']['content'].strip()
        roadblocks = json.loads(assistant_reply)

        # Render the updated roadmap
        return render_template('roadmap.html', roadblocks=roadblocks, name=name)
    except Exception as e:
        error_message = f"An error occurred: {str(e)}"
        return render_template('error.html', error_message=error_message)
