from app import create_app

app = create_app()

# run the application if this file is executed as the main program
if __name__ == '__main__':
    app.run(debug=True)
