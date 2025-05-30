# gets database from config.py
from config import db
from enum import Enum

class RankEnum(Enum):
    UNRANKED = 0
    IRON_1 = 1
    IRON_2 = 2
    IRON_3 = 3
    BRONZE_1 = 4
    BRONZE_2 = 5
    BRONZE_3 = 6


class PlayerProfile(db.Model):
    # unique Database int ID
    ___tablename___ = "player_profiles"
    id = db.Column(db.Integer, primary_key = True)
    player_name = db.Column(db.String(100), unique = False, nullable = False)
    player_user = db.Column(db.String(100), unique = True, nullable = False)
    player_rank = db.Column(db.Integer, nullable = False)
    # player_agentpool = db.Column(...)

    # converts data into a dictionary 
    def to_json(self):
        return {
            "id": self.id,
            "playerName": self.player_name,
            "playerUser": self.player_user,
            "playerRank": RankEnum(self.player_rank).name,
        }
