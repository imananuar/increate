from flask import Flask, request, jsonify
import whisper
import os
import torch

app = Flask(__name__)

# Load model on startup (adjust size based on your GPU memory)
MODEL_NAME = os.getenv('WHISPER_MODEL', 'base')
model = whisper.load_model(MODEL_NAME)

@app.route('/transcribe', methods=['POST'])
def transcribe():
    data = request.json
    audio_path = data.get('audio_path')
    
    if not audio_path or not os.path.exists(audio_path):
        return jsonify({'error': 'Audio file not found'}), 400
    
    try:
        # Check for GPU availability
        device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # Transcribe
        result = model.transcribe(
            audio_path,
            language='en',  # Or auto-detect
            fp16=torch.cuda.is_available()
        )
        
        return jsonify({
            'success': True,
            'text': result['text'],
            'segments': result.get('segments', [])
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model': MODEL_NAME,
        'device': 'cuda' if torch.cuda.is_available() else 'cpu'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9001)