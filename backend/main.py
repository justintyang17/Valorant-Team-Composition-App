# CRUD (create, read, update, delete) API

from flask import request, jsonify
from config import app, db
from models import RankEnum, PlayerProfile, RoleEnum, TraitEnum, AgentTable, AgentTraitTable, MapEnum, PlayerMapTable, MapAgentTable
import re
from initialization import *

# 1) Get Profiles
@app.route("/profiles", methods=["GET"]) # Decorater: defines the endroute (/profiles) + valid methods for that endroute URL
def get_profiles():
    # uses Flask SQLAlchemy to retrieve all profiles from database
    profiles = PlayerProfile.query.all()
    # convert each python object in profiles into JSON objects
    json_profiles = list(map(lambda x: x.to_json(), profiles))
    return jsonify({"profiles": json_profiles})

# 2) Create Profile
@app.route("/create_profile", methods=["POST"])
def create_profile():
    player_name = request.json.get("playerName")
    player_user = request.json.get("playerUser")
    player_rank_string = request.json.get("playerRank")

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
        player_rank=player_rank
        )

        db.session.add(new_profile)
        db.session.flush()
        createAgentPool(new_profile)
        db.session.commit()

    except Exception as e:
        return jsonify({"message": str(e)}), 400
       
    return jsonify({"message": "new profile sucessfully created"}), 201

# Helper: Creates entries in PlayerMap and MapAgent Tables for new Profile
def createAgentPool(new_profile):
    user_id = new_profile.id
    agents = AgentTable.query.all()
    for m in MapEnum:
        new_pmp_entry = PlayerMapTable(
            player_id = user_id,
            map = m
        )
        db.session.add(new_pmp_entry)
        db.session.flush()
        for a in agents:
            new_map_entry = MapAgentTable(
                pmp_id = new_pmp_entry.pmp_id,
                agent_id = a.agent_id,
                # (!!!) Need to add User Input Implementation
                proficiency = 0
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

        # check if new rank is valid
        new_player_rank = data.get("playerRank", profile.player_rank)

        if new_player_rank:
            try:
                profile.player_rank = RankEnum[new_player_rank].value
            except KeyError:
                raise Exception("ERROR: invalid player rank")

        # modify the given profile's fields if new info is provided for that field
        profile.player_name = data.get("playerName", profile.player_name)   
        profile.player_user = new_player_user

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
        db.create_all()
        initializeAssets()
    app.run(debug=True)


