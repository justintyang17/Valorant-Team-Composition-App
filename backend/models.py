# gets database from config.py
from config import db

class PlayerProfile(db.Model):
    # unique Database int ID
    id = db.Column(db.Integer, primary_key = True)
    player_name = db.Column(db.String(100), unique = False, nullable = False)
    player_user = db.Column(db.String(100), unique = True, nullable = False)
    player_rank = db.Column(db.String(100), unique = False, nullable = False)
    # player_agentpool = db.Column(...)

    # converts data into a dictionary 
    def to_json(self):
        return {
            "id": self.id,
            "playerName": self.player_name,
            "playerUser": self.player_user,
            "playerRank": self.player_rank,
        }