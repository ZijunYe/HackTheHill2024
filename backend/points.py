
@app.route('/points', methods=['PATCH'])
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
