
# FakeBuster - Integrated Flask & React Application

This project combines a React frontend with a Flask backend to detect fake social media accounts based on uploaded images.

## Project Structure

```
fakebuster/
├── app.py                    # Flask backend application
├── fake_account_detection.py # Your AI detection script (you need to provide this)
├── requirements.txt          # Python dependencies
├── uploads/                  # Folder where uploaded images are stored
├── dist/                     # Built React frontend (created after building)
└── src/                      # React frontend source code
```

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Step 1: Install Python Dependencies

```bash
# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required Python packages
pip install -r requirements.txt
```

### Step 2: Add Your Detection Script

1. Place your `fake_account_detection.py` file in the root directory (same level as `app.py`)
2. Make sure it implements the `detect_fake_account(platform, image_paths)` function as shown in the template

### Step 3: Build the React Frontend

```bash
# Install JavaScript dependencies
npm install

# Build the production-ready frontend
npm run build
```

### Step 4: Run the Application

```bash
# Start the Flask server
python app.py
```

The application will be available at http://localhost:5000

## API Endpoints

The Flask backend provides the following API endpoints:

- `POST /api/upload` - Upload images for detection
- `GET /api/status/<upload_id>` - Check the status of a detection request

## Important Notes

- The `fake_account_detection.py` file must implement the `detect_fake_account` function
- In a production environment, you should use a proper database instead of in-memory storage
- For production deployment, consider using Gunicorn or uWSGI instead of Flask's development server
- Add proper error handling and validation for a production application
