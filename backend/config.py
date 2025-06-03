from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# SET UP

#Initialize App
app = Flask(__name__)
#Enable Cross Origin Requests
CORS(app)
#Specify location of local SQL database (name = mydatabase)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
#No tracking database changes
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

#Initialize Database instance
db = SQLAlchemy(app)
