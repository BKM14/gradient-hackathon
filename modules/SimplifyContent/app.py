from flask import Flask, request, jsonify
from main import process_content
from models import save_article

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to the SimplifyContent App!"

@app.route('/process', methods=['POST'])
def process():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400
    
    data = request.get_json()
    if 'text' not in data:
        return jsonify({"error": "text field is required"}), 400
        
    # Process the text
    processed_article = process_content(data['text'])
    
    # Save to MongoDB
    save_article(processed_article)
    
    return jsonify(processed_article), 201

if __name__ == '__main__':
    app.run(debug=True)