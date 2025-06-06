
#!/usr/bin/env python3
"""
Simple script to run the Flask backend server
"""

from app import app

if __name__ == '__main__':
    print("Starting Diagnosify Backend Server...")
    print("Server will be available at: http://localhost:5000")
    print("Health check endpoint: http://localhost:5000/health")
    print("\nMake sure to place your .sav model files in the 'models' directory!")
    app.run(debug=True, host='0.0.0.0', port=5000)
