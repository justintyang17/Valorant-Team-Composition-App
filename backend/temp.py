

from enum import Enum
from dataclasses import dataclass
from config import db

'''
jett = Agent("Jett", Role.DUELIST, [Trait.ENTRY])
raze = Agent("Raze", Role.DUELIST, [Trait.ENTRY, Trait.STALL])
reyna = Agent("Reyna", Role.DUELIST, [Trait.FLASH])
phoenix = Agent("Phoenix", Role.DUELIST, [Trait.FLASH, Trait.STALL])

sova = Agent("Sova", Role.INITIATOR, [Trait.RECON_H])
fade = Agent("Fade", Role.INITIATOR, [Trait.RECON_H])
skye = Agent("Skye", Role.INITIATOR, [Trait.FLASH, Trait.RECON_L])
breach = Agent("Breach", Role.INITIATOR, [Trait.FLASH, Trait.STALL])

omen = Agent("Omen", Role.CONTROLLER, [Trait.BALL_SMOKES])
brim = Agent("Brim", Role.CONTROLLER, [Trait.BALL_SMOKES])
viper = Agent("Viper", Role.CONTROLLER, [Trait.WALL_SMOKES, Trait.STALL])
harbour = Agent("Harbour", Role.CONTROLLER, [Trait.WALL_SMOKES])

sage = Agent("Sage", Role.SENTINEL, [Trait.STALL])
killjoy = Agent("Killjoy", Role.SENTINEL, [Trait.TRIPS, Trait.STALL])
cypher = Agent("Cypher", Role.SENTINEL, [Trait.TRIPS, Trait.RECON_L])
vyse = Agent("Vyse", Role.SENTINEL, [Trait.TRIPS, Trait.STALL])

AGENT_LIST = [jett, raze, reyna, phoenix, sova, fade, skye, breach,
              omen, brim, viper, harbour, sage, killjoy, cypher, vyse]
'''

class RoleEnum(Enum):
    DUELIST = "Duelist"
    INITIATOR = "Initiator"
    CONTROLLER = "Controller"
    SENTINEL = "Sentinel"

class TraitEnum(Enum):
    BALL_SMOKES = "Ball Smokes"
    WALL_SMOKES = "Wall Smokes"
    FLASH = "Flash"
    RECON_H = "Heavy Recon"
    RECON_L = "Light Recon"
    TRIPS = "Trips"
    ENTRY = "Entry"
    STALL = "Stall"

# Table storing all agent information
class AgentTable(db.Model):
    ___tablename___ = "agents"
    agent_id = db.Column(db.Integer, primary_key = True)
    agent_name = db.Column(db.String(100), unique = False, nullable = False)
    agent_role = db.Column(db.String(100), nullable = False)

    # converts data into a dictionary 
    def to_json(self):
        return {
            "agentID": self.agent_id,
            "agentName": self.agent_name,
            "playerRank": RoleEnum(self.agent_role).name,
        }

# Table storing which traits belong to which agents
class AgentTraitTable(db.Model):
    ___tablename___ = "agent_traits_db"
    trait_id = db.Column(db.Integer, primary_key = True)
    agent_id = db.Column(db.String, db.ForeignKey("agents.agent_id"))
    trait = db.Column(db.String(100), nullable = False)

    # converts data into a dictionary 
    def to_json(self):
        return {
            "traitID": self.agent_id,
            "agentID": self.agent_id,
            "trait": TraitEnum(self.trait).name,
        }

class MapEnum(Enum):
    BIND = "Bind"
    Haven = "Haven"
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

# Table storing player-map pool for all players
class PlayerMapTable(db.Model):
    ___tablename___ = "player_mappool_db"
    pmp_id = db.Column(db.Integer, primary_key = True)
    player_id = db.Column(db.String, db.ForeignKey("player_profiles.id"))
    map = db.Column(db.String(100), nullable = False)

    # converts data into a dictionary 
    def to_json(self):
        return {
            "pmpID": self.pmp_id,
            "playerID": self.player_id,
            "map": MapEnum(self.map).name,
        }
    
# Table storing map-agent pool for all players
class MapAgentTable(db.Model):
    ___tablename___ = "map_agentpool_db"
    map_id = db.Column(db.Integer, primary_key = True)
    pmp_id = db.Column(db.String, db.ForeignKey("agents.agents_id"))
    agent_id = db.Column(db.String, db.ForeignKey("player_mappool_db.pmp_id"))
    proficieny = db.Column(db.Integer, nullable = False)

    # converts data into a dictionary 
    def to_json(self):
        return {
            "mapID": self.map_id,
            "pmpID": self.pmp_id,
            "agentID": self.agent_id,
            "proficieny": self.proficieny,
        }
    