# CRUD (create, read, update, delete) API

from flask import request, jsonify
from config import app, db
from models import RankEnum, PlayerProfile, RoleEnum, TraitEnum, AgentTable, AgentTraitTable, MapEnum, PlayerMapTable, MapAgentTable
import re
from initialization import *

# 1.1) Get Profiles
@app.route("/profiles", methods=["GET"]) # Decorater: defines the endroute (/profiles) + valid methods for that endroute URL
def get_profiles():
    # uses Flask SQLAlchemy to retrieve all profiles from database
    profiles = PlayerProfile.query.all()
    # convert each python object in profiles into JSON objects
    json_profiles = list(map(lambda x: x.to_json(), profiles))
    return jsonify({"profiles": json_profiles})

# 1.2) Get Agents
@app.route("/agents", methods=["GET"]) # Decorater: defines the endroute (/profiles) + valid methods for that endroute URL
def get_agents():
    # uses Flask SQLAlchemy to retrieve all agents from database
    agents = AgentTable.query.all()
    # convert each python object in profiles into JSON objects
    json_agents = list(map(lambda x: x.to_json(), agents))
    return jsonify({"agents": json_agents})

# 1.3) Get Map Pool Template for Profile Creation
@app.route("/template", methods=["GET"]) # Decorater: defines the endroute (/profiles) + valid methods for that endroute URL
def get_template():
    # uses Flask SQLAlchemy to retrieve all agents from database
    agents = AgentTable.query.all()
    # get list of agentIDs from agents
    agent_data = [agent.agent_id for agent in agents]

    # create template of JSON object from scratch
    template = []
    for m in MapEnum:
        template.append({
            "map": m.name,
            "agentPool": [
                {
                    "agentID": a,
                    "proficiency": 0
                } 
                for a in agent_data
            ]
        })

    return jsonify({"template": template})

# 1.4) Get Agent Traits
@app.route("/traits", methods=["GET"]) # Decorater: defines the endroute (/profiles) + valid methods for that endroute URL
def get_traits():
    # uses Flask SQLAlchemy to retrieve all agents from database
    traits = AgentTraitTable.query.all()
    # convert each python object in profiles into JSON objects
    json_traits = list(map(lambda x: x.to_json(), traits))
    return jsonify({"traits": json_traits})

# 2) Create Profile
@app.route("/create_profile", methods=["POST"])
def create_profile():
    player_name = request.json.get("playerName")
    player_user = request.json.get("playerUser")
    player_rank_string = request.json.get("playerRank")

    player_map_pool = request.json.get("playerMapPool")

    if not player_name or not player_user or not player_rank_string:
        return jsonify({"message": "ERROR: missing field"}), 400 # Status Message
    
    # try adding newly created Profile to Database, else return error message
    try:
        # Check if username is valid
        if not re.search(r"^[a-zA-Z0-9]{3,16}#[a-zA-Z0-9]{1,5}$", player_user):
            raise Exception("ERROR: invalid player username (riot id)")
        
        # Check if username already exists
        profiles = PlayerProfile.query.all()
        for p in profiles:
            if (p.player_user == player_user):
                raise Exception("ERROR: player with given username already exist")
        
        # Check if rank is valid
        try:
            player_rank = RankEnum[player_rank_string].value
        except KeyError:
            raise Exception("ERROR: invalid player rank")

        new_profile = PlayerProfile(
        player_name=player_name,
        player_user=player_user,
        player_rank=player_rank,
        # don't include player_map_pool, it is a relationship (not an actually column in db)
        # already handled by createAgentPool()
        )

        db.session.add(new_profile)
        db.session.flush()
        createAgentPool(new_profile, player_map_pool)
        db.session.commit()

    except Exception as e:
        return jsonify({"message": str(e)}), 400
       
    return jsonify({"message": "new profile sucessfully created"}), 201

# Helper: Creates entries in PlayerMap and MapAgent Tables for new Profile
def createAgentPool(new_profile, player_map_pool):
    user_id = new_profile.id
    for player_map_entry in player_map_pool:
        m = MapEnum[player_map_entry["map"]]
        new_pmp_entry = PlayerMapTable(
            player_id = user_id,
            map = m
        )
        db.session.add(new_pmp_entry)
        db.session.flush()
        for map_agent_entry in player_map_entry["agentPool"]:
            new_map_entry = MapAgentTable(
                pmp_id = new_pmp_entry.pmp_id,
                agent_id = map_agent_entry["agentID"],
                proficiency = map_agent_entry["proficiency"]
            )
            db.session.add(new_map_entry) 

# 3) Update Profile
@app.route("/update_profile/<int:user_id>", methods=["PATCH"])
def update_profile(user_id):
    profile = PlayerProfile.query.get(user_id)

    # return error message if profile not found
    if not profile:
        return jsonify({"message": "ERROR: player not found"}), 404

    # data = JSON data in database
    data = request.json

    new_player_user = data.get("playerUser", profile.player_user)
    
    try:
        # check if new username is valid
        if not re.search(r"^[a-zA-Z0-9]{3,16}#[a-zA-Z0-9]{1,5}$", new_player_user):
            raise Exception("ERROR: invalid player username (riot id)")
        
        # check if new username already exists
        existing_user = PlayerProfile.query.filter(
            PlayerProfile.player_user == new_player_user,
            PlayerProfile.id != user_id
        ).first()
        if existing_user:
            return jsonify({"message": "ERROR: player with given username already exists"}), 409

        profile.player_user = new_player_user

        # check if new rank is valid
        new_player_rank = data.get("playerRank", profile.player_rank)

        if new_player_rank:
            try:
                profile.player_rank = RankEnum[new_player_rank].value
            except KeyError:
                raise Exception("ERROR: invalid player rank")

        # modify the given profile name if new info is provided
        profile.player_name = data.get("playerName", profile.player_name) 

        # map_pool_data = inputted map_pool from frontend
        map_pool_data = data.get("playerMapPool", [])

        # loop through each player_map entry in inputted data
        for player_map_entry in map_pool_data:
            map_name = player_map_entry["map"]

            # get the associated player_map object from the database 
            for m in profile.player_map_pool:
                if m.map.name == map_name:
                    map_obj = m

            # loop through each map_agent entry in inputted data
            for map_agent_entry in player_map_entry["agentPool"]:
                agent_id = map_agent_entry["agentID"]
                new_prof = map_agent_entry["proficiency"]

                # get the associated map_agent object from the database 
                for a in map_obj.agent_pool:
                    if a.agent_id == agent_id:
                        agent_obj = a
                # change the proficiency value from database to inputted value
                agent_obj.proficiency = new_prof

        db.session.commit()
        
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "profile sucessfully updated"}), 200

# 4) Delete Profile
@app.route("/delete_profile/<int:user_id>", methods=["DELETE"])
def delete_profile(user_id):
    profile = PlayerProfile.query.get(user_id)

    # return error message if profile not found
    if not profile:
        return jsonify({"message": "ERROR: player not found"}), 401
    
    #deleteAgentPool(profile)
    db.session.delete(profile)
    db.session.commit()

    return jsonify({"message": "profile sucessfully deleted"}), 200 

# Helper: Removes entries in PlayerMap and MapAgent Tables of given Profile
# NOT NEEDED ANYMORE due to cascading in models.py
def deleteAgentPool(profile):
    pmp_list = PlayerMapTable.query.filter_by(player_id = profile.id).all()
    for pmp in pmp_list:
        map_list = MapAgentTable.query.filter_by(pmp_id = pmp.pmp_id).all()
        for map in map_list:
            db.session.delete(map)
        db.session.delete(pmp)
    


# ensures file only runs when explicitly ran (not when imported)
if __name__ == "__main__":
# creates all the models in the database
    with app.app_context():
        db.drop_all()
        db.create_all()
        initializeAssets()
    app.run(debug=True)


