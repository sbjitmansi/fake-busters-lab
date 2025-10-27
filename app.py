
import os
import time
import uuid
import json
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from fake_account_detection import detect_fake_account

app = Flask(__name__, static_folder='dist')

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Create uploads folder if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Helper functions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# In-memory storage for detection results (in production, use a proper database)
detection_results = {}

@app.route('/api/upload', methods=['POST'])
def upload_images():
    if 'platform' not in request.form:
        return jsonify({'success': False, 'message': 'Platform not specified'}), 400
    
    platform = request.form['platform']
    
    # Check if any files were uploaded
    if len(request.files) == 0:
        return jsonify({'success': False, 'message': 'No images uploaded'}), 400
    
    # Save uploaded images
    image_paths = []
    for key in request.files:
        file = request.files[key]
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Add a timestamp to avoid filename conflicts
            unique_filename = f"{time.time()}_{filename}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(file_path)
            image_paths.append(file_path)
    
    if not image_paths:
        return jsonify({'success': False, 'message': 'No valid images uploaded'}), 400
    
    # Generate a unique ID for this detection request
    upload_id = str(uuid.uuid4())
    
    # Start a background process to run the detection (in a real app, use a task queue)
    # For now, we'll simulate this by storing the request and marking it as in progress
    detection_results[upload_id] = {'status': 'processing', 'platform': platform, 'image_paths': image_paths}
    
    # In a real application, you might want to use Celery or similar to run this as a background task
    # For simplicity, we'll process it immediately (this would block the request in a real app)
    try:
        # Call the detection function from fake_account_detection.py
        result = detect_fake_account(platform, image_paths)
        detection_results[upload_id] = {
            'status': 'complete',
            'result': result
        }
    except Exception as e:
        detection_results[upload_id] = {
            'status': 'error',
            'error': str(e)
        }
    
    return jsonify({
        'success': True,
        'message': 'Images uploaded successfully',
        'uploadId': upload_id
    })

@app.route('/api/status/<upload_id>', methods=['GET'])
def check_status(upload_id):
    if upload_id not in detection_results:
        return jsonify({'complete': False, 'message': 'Upload ID not found'}), 404
    
    result = detection_results[upload_id]
    
    if result['status'] == 'processing':
        return jsonify({'complete': False})
    elif result['status'] == 'error':
        return jsonify({'complete': False, 'error': result['error']}), 500
    else:
        return jsonify({
            'complete': True,
            'result': result['result']
        })

# Serve the static files from the React build
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    print("Starting Flask server...")
    print("Place your fake_account_detection.py file in the same directory as app.py")
    print("Serving static files from:", app.static_folder)
    app.run(debug=True, host='0.0.0.0', port=5000)
