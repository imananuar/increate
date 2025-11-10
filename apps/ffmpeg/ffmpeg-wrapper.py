from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

@app.route('/audio-to-wav', methods=['POST'])
def audio_to_wav():
    data = request.json
    input_path = data.get('input')
    output_path = data.get('output')
    
    if not input_path or not output_path:
        return jsonify({'error': 'Missing input or output path'}), 400
    
    try:
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Run ffmpeg to extract audio as WAV
        cmd = [
            'ffmpeg',
            '-i', input_path,
            '-ar', '16000',      # Sample rate for Whisper
            '-ac', '1',          # Mono channel
            '-c:a', 'pcm_s16le', # 16-bit PCM
            '-y',                # Overwrite output
            output_path
        ]
        
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=True
        )
        
        return jsonify({
            'success': True,
            'output': output_path,
            'stdout': result.stdout
        })
        
    except subprocess.CalledProcessError as e:
        return jsonify({
            'error': 'FFmpeg failed',
            'stderr': e.stderr
        }), 500

@app.route('/get-duration', methods=['POST'])
def get_duration():
    data = request.json
    input_path = data.get('input')
    
    try:
        cmd = [
            'ffprobe',
            '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'json',
            input_path
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return jsonify({'success': True, 'output': result.stdout})
        
    except subprocess.CalledProcessError as e:
        return jsonify({'error': e.stderr}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000)