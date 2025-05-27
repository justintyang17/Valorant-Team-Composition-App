# gets database from config.py
from config import db
from enum import Enum

class PlayerRankEnum(Enum):
    IRON_1 = 1
    IRON_2 = 2
    IRON_3 = 3
    BRONZE_1 = 4
    BRONZE_2 = 5
    BRONZE_3 = 6
    SILVER_1 = 7
    SILVER_2 = 8
    SILVER_3 = 9
    GOLD_1 = 10
    GOLD_2 = 11
    GOLD_3 = 12
    PLAT_1 = 13
    PLAT_2 = 14
    PLAT_3 = 15
    DIAMOND_1 = 16
    DIAMOND_2 = 17
    DIAMOND_3 = 18
    ASCENDANT_1 = 19
    ASCENDANT_2 = 20
    ASCENDANT_3 = 21
    IMMORTAL = 22
    RADIANT = 23

    @staticmethod
    def from_string(label: str):
        label = label.strip().lower().replace(" ", "_")
        for rank in PlayerRankEnum:
            if rank.name.lower() == label:
                return rank
        raise ValueError("Invalid rank string.")
    
    def __str__(self):
        return self.name.replace("_", " ").lower().title()

class PlayerProfile(db.Model):
    # unique Database int ID
    id = db.Column(db.Integer, primary_key = True)
    player_name = db.Column(db.String(100), unique = False, nullable = False)
    player_user = db.Column(db.String(100), unique = True, nullable = False)
    player_rank = db.Column(db.Integer, nullable = False)

    # converts data into a dictionary 
    def to_json(self):
        return {
            "id": self.id,
            "playerName": self.player_name,
            "playerUser": self.player_user,
            "playerRank": str(PlayerRankEnum(self.player_rank)),
        }