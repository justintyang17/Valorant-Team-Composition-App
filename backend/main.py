# CRUD (create, read, update, delete) API

from flask import request, jsonify
from config import app, db
from models import PlayerProfile, PlayerRankEnum
import re


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
    player_rank = request.json.get("playerRank")
    if not player_name or not player_user or not player_rank:
        return jsonify({"message": "ERROR: missing field"}), 400 # Status Message
    
    # try adding newly created Profile to Database, else return error message
    try:
        # Check if Username is valid
        if not re.search(r"^[a-zA-Z0-9]{3,16}#[a-zA-Z0-9]{1,5}$", player_user):
            raise Exception("ERROR: invalid player username (riot id)")
        
        # Check if Username already taken
        existing_user = PlayerProfile.query.filter(
            PlayerProfile.player_user == player_user,
        ).first()
        if existing_user:
            return jsonify({"message": "ERROR: player with given username already exists"}), 409
        
        # convert rank string into enum format
        try:
            player_rank_enum = PlayerRankEnum.from_string(player_rank)
        except Exception as e:
            return jsonify({"message": str(e)}), 400

        new_profile = PlayerProfile(
            player_name = player_name, 
            player_user = player_user, 
            player_rank = player_rank_enum.value)
        
        db.session.add(new_profile)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "new profile sucessfully created"}), 201

# 3) Update Profile
@app.route("/update_profile/<int:user_id>", methods=["PATCH"])
def update_profile(user_id):
    profile = PlayerProfile.query.get(user_id)

    # return error message if profile not found
    if not profile:
        return jsonify({"message": "ERROR: player not found"}), 401
    
    # data = JSON data in database
    data = request.json

    new_player_user = data.get("playerUser", profile.player_user)

    # check if updated username already exists
    existing_user = PlayerProfile.query.filter(
        PlayerProfile.player_user == new_player_user,
        PlayerProfile.id != user_id
    ).first()
    if existing_user:
        return jsonify({"message": "ERROR: player with given username already exists"}), 409

    # modify the given profile's fields if new info is provided for that field
    profile.player_name = data.get("playerName", profile.player_name)   
    profile.player_user = new_player_user

    if "playerRank" in data:
        try:
            new_player_rank_enum = PlayerRankEnum.from_string(data["playerRank"])
            profile.player_rank = new_player_rank_enum.value
        except ValueError:
            return jsonify({"message": "ERROR: invalid player rank"}), 400

    db.session.commit()

    return jsonify({"message": "profile sucessfully updated"}), 200

# 4) Delete Profile
@app.route("/delete_profile/<int:user_id>", methods=["DELETE"])
def delete_profile(user_id):
    profile = PlayerProfile.query.get(user_id)

    # return error message if profile not found
    if not profile:
        return jsonify({"message": "ERROR: player not found"}), 401
    
    db.session.delete(profile)
    db.session.commit()

    return jsonify({"message": "profile sucessfully deleted"}), 200

# ensures file only runs when explicitly ran (not when imported)
if __name__ == "__main__":
# creates all the models in the database
    with app.app_context():
        db.create_all()

    app.run(debug=True)

# Test Functions

