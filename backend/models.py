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

class RoleEnum(Enum):
    DUELIST = "Duelist"
    INITIATOR = "Initiator"
    CONTROLLER = "Controller"
    SENTINEL = "Sentinel"

class TraitEnum(Enum):
    BALL_SMOKES = "Ball_Smokes"
    WALL_SMOKES = "Wall_Smokes"
    FLASH = "Flash"
    RECON = "Recon"
    TRIPS = "Trips"
    ENTRY = "Entry"
    STALL = "Stall"

# Table storing all agent information
class AgentTable(db.Model):
    __tablename__ = "agents"
    agent_id = db.Column(db.Integer, primary_key = True)
    agent_name = db.Column(db.String(100), nullable = False)
    agent_role = db.Column(db.Enum(RoleEnum), nullable = False)

    # converts data into a dictionary 
    def to_json(self):
        return {
            "agentID": self.agent_id,
            "agentName": self.agent_name,
            "agentRole": self.agent_role.name,
        }

# Table storing which traits belong to which agents
class AgentTraitTable(db.Model):
    __tablename__ = "agent_traits_db"
    trait_id = db.Column(db.Integer, primary_key = True)
    agent_id = db.Column(db.String, db.ForeignKey("agents.agent_id"))
    trait = db.Column(db.Enum(TraitEnum), nullable = False)

    # converts data into a dictionary 
    def to_json(self):
        return {
            "traitID": self.agent_id,
            "agentID": self.agent_id,
            "trait": self.trait.name,
        }

class MapEnum(Enum):
    BIND = "Bind"
    HAVEN = "Haven"
    SPLIT = "Split"
    ASCENT = "Ascent"
    ICEBOX = "Icebox"
    '''
    BREEZE = "Breeze"
    FRACTURE = "Fracture"
    PEARL = "Pearl"
    LOTUS = "Lotus"
    SUNSET = "Sunset"
    ABYSS = "Abyss"
    '''

# Table storing map-agent pool for all players
class MapAgentTable(db.Model):
    __tablename__ = "map_agentpool_db"
    map_id = db.Column(db.Integer, primary_key = True)
    pmp_id = db.Column(db.String, db.ForeignKey("player_mappool_db.pmp_id"))
    agent_id = db.Column(db.String, db.ForeignKey("agents.agent_id"))
    proficiency = db.Column(db.Integer, nullable = False)

    # converts data into a dictionary 
    def to_json(self):
        return {
            "mapID": self.map_id,
            "pmpID": self.pmp_id,
            "agentID": self.agent_id,
            "proficiency": self.proficiency,
        }

# Table storing player-map pool for all players
class PlayerMapTable(db.Model):
    __tablename__ = "player_mappool_db"
    pmp_id = db.Column(db.Integer, primary_key = True)
    player_id = db.Column(db.String, db.ForeignKey("player_profiles.id"))
    map = db.Column(db.Enum(MapEnum), nullable = False)
    agent_pool = db.relationship(MapAgentTable, backref = "map_pool", cascade ="all, delete-orphan")

    # converts data into a dictionary 
    def to_json(self):
        return {
            "pmpID": self.pmp_id,
            "playerID": self.player_id,
            "map": self.map.name,
            "agentPool": [a.to_json() for a in self.agent_pool],
        }
    

class PlayerProfile(db.Model):
    # unique Database int ID
    __tablename__ = "player_profiles"
    id = db.Column(db.Integer, primary_key = True)
    player_name = db.Column(db.String(100), unique = False, nullable = False)
    player_user = db.Column(db.String(100), unique = True, nullable = False)
    player_rank = db.Column(db.Integer, nullable = False)
    map_pool = db.relationship(PlayerMapTable, backref = "player", cascade ="all, delete-orphan")

    # converts data into a dictionary 
    def to_json(self):
        return {
            "id": self.id,
            "playerName": self.player_name,
            "playerUser": self.player_user,
            "playerRank": RankEnum(self.player_rank).name,
            "mapPool": [m.to_json() for m in self.map_pool],
        }

    
