from app import create_app
import os

app = create_app()

# run the application if this file is executed as the main program
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
