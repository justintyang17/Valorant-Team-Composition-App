# CRUD (create, read, update, delete) API

from flask import request, jsonify
from config import app, db
from models import PlayerProfile


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
    
    new_profile = PlayerProfile(player_name = player_name, player_user = player_user, player_rank = player_rank)
    # try adding newly created Profile to Database, else return error message
    try:
        db.session.add(new_profile)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "new profile sucessfully created"}), 200

# 3) Update Profile
@app.route("/update_profile/<int:user_id>", methods=["PATCH"])
def update_profile(user_id):
    profile = PlayerProfile.query.get(user_id)

    # return error message if profile not found
    if not profile:
        return jsonify({"message": "ERROR: player not found"}), 401
    
    # data = JSON data in database
    data = request.json
    # modify the given profile's fields if new info is provided for that field
    profile.player_name = data.get("playerName", profile.player_name)
    profile.player_user = data.get("playerUser", profile.player_user)
    profile.player_rank = data.get("playerRank", profile.player_rank)

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
    
    # data = JSON data in database
    data = request.json
    # modify the given profile's fields if new info is provided for that field
    profile.player_name = data.get("playerName", profile.player_name)
    profile.player_user = data.get("playerUser", profile.player_user)
    profile.player_rank = data.get("playerRank", profile.player_rank)

    db.session.commit()

    return jsonify({"message": "profile sucessfully updated"}), 201

# ensures file only runs when explicitly ran (not when imported)
if __name__ == "__main__":
# creates all the models in the database
    with app.app_context():
        db.create_all()

    app.run(debug=True)


