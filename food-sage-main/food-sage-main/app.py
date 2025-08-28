from flask import Flask, render_template, request, jsonify
import os
import cv2
import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image
import io

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load models (in a real app, these would be properly trained models)
# For demo purposes, we'll use placeholder functions
try:
    # food_model = load_model('food_models/food_classification_model.h5')
    # freshness_model = load_model('food_models/freshness_model.h5')
    pass
except:
    print("Model files not found. Using placeholder functions.")

# Food database (matches the frontend)
food_db = {
    'apple': {
        'name': 'Apple',
        'type': 'Fruit',
        'state': 'Raw',
        'ph': 3.3,
        'freshness': 85,
        'freshness_duration': '5-7 days at room temperature',
        'edible': True,
        'spoiled': False,
        'calories': 95,
        'carbs': 25,
        'protein': 0.5,
        'fat': 0.3,
        'pros': [
            'High in fiber and vitamin C',
            'Low in calories',
            'Contains antioxidants',
            'May support heart health'
        ],
        'cons': [
            'Contains natural sugars',
            'May cause bloating in some people'
        ],
        'recipes': [
            {'name': 'Apple Pie', 'image': 'apple_pie.jpg'},
            {'name': 'Apple Smoothie', 'image': 'apple_smoothie.jpg'},
            {'name': 'Apple Salad', 'image': 'apple_salad.jpg'}
        ]
    },
    # ... other foods same as in frontend
}

def preprocess_image(image):
    """Preprocess image for model input"""
    try:
        # Convert to numpy array
        img = np.array(image)
        
        # Resize to model's expected input
        img = cv2.resize(img, (224, 224))
        
        # Normalize pixel values
        img = img / 255.0
        
        # Add batch dimension
        img = np.expand_dims(img, axis=0)
        
        return img
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None

def predict_food_type(image):
    """Predict food type from image (placeholder function)"""
    # In a real app, this would use the loaded model
    # For demo, we'll return a random food
    food_keys = list(food_db.keys())
    return np.random.choice(food_keys)

def assess_freshness(image):
    """Assess freshness from image (placeholder function)"""
    # In a real app, this would use computer vision techniques
    # For demo, return random values
    return {
        'freshness': np.random.randint(10, 100),
        'ph': round(np.random.uniform(3.0, 7.0), 1),
        'spoiled': np.random.random() > 0.7
    }

def calculate_nutrition(food_type, state):
    """Get nutrition info from database"""
    food = food_db.get(food_type, {})
    return {
        'calories': food.get('calories', 0),
        'carbs': food.get('carbs', 0),
        'protein': food.get('protein', 0),
        'fat': food.get('fat', 0)
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        # Read image file
        image = Image.open(io.BytesIO(file.read()))
        
        # Save the file (for demo purposes)
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        image.save(filename)
        
        # Preprocess image
        processed_img = preprocess_image(image)
        if processed_img is None:
            return jsonify({'error': 'Image processing failed'}), 400
        
        # Predict food type (placeholder)
        food_type = predict_food_type(processed_img)
        
        # Assess freshness (placeholder)
        freshness_data = assess_freshness(processed_img)
        
        # Get food data
        food_data = food_db.get(food_type, {})
        
        # Combine all data
        result = {
            'name': food_data.get('name', 'Unknown'),
            'type': food_data.get('type', 'Unknown'),
            'state': food_data.get('state', 'Unknown'),
            'ph': freshness_data['ph'],
            'freshness': freshness_data['freshness'],
            'freshness_duration': food_data.get('freshness_duration', 'Unknown'),
            'edible': not freshness_data['spoiled'],
            'spoiled': freshness_data['spoiled'],
            'calories': food_data.get('calories', 0),
            'carbs': food_data.get('carbs', 0),
            'protein': food_data.get('protein', 0),
            'fat': food_data.get('fat', 0),
            'pros': food_data.get('pros', []),
            'cons': food_data.get('cons', []),
            'recipes': food_data.get('recipes', [])
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)