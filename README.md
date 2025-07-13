# Valorant Composition Builder By: Justin Yang

## 🧠 Background Information

Valorant is a competitive 5-on-5 team-based shooter where each match takes place on a specific map, and each player selects one of 27 unique characters called agents. Each agent has a distinct set of abilities that gives them particular roles in the game. To give your team the best chance of victory, you need to assign each teammate an agent so that:
  1) everyone is comfortable playing their chosen agent on the current map, and
  2) all roles are covered as effectively as possible.

My app makes the agent-selection phase simple and easy by allowing players to create profiles that show which agents they can play on each map. Then, the app runs an algorithm that, when given 5 player profiles and a specific map, automatically generates the most optimal team composition.

## 🔧 Tech Stack

### Backend
-  Python Flask
-  SQL Alchemy
-  SQLite

### Frontend
-  React Javascript
    - Node.js 
    - Material UI
    - dnd-kit (Drag and Drop)
-  CSS + HMTL

## 🔎 App Demo 

![](https://github.com/justintyang17/Valo-App/blob/main/CreateProfile.gif)

![](https://github.com/justintyang17/Valo-App/blob/main/BuildingTeam.gif)

## ▶️ How to Run the Program
1) Clone the repo and open the folder
```
git clone https://github.com/justintyang17/Valo-App.git
```
2) Split the terminal
3) In one of the terminals run:
```
cd backend
pip install -r requirements.txt
python main.py
```
4) In the other terminal run:
```
cd frontend
npm install
npm run dev
```
5) Open http://localhost:5173/ in a browser

## 🔨 Database Structure
<img width="848" height="464" alt="Image" src="https://github.com/user-attachments/assets/c5fe2d31-52d5-4975-a9e9-b98baf7f6efd" />

## 🔬 Teambuilder Algorithm
<ins>Glossary:</ins>
- **pairObj** = An object that holds:
    - a player's name
    - the agent selected by the algorithm
- **playerObj** = An object that holds:
    - a player's name
    - their high proficiency list (agents they can use well on a given map) 
    - their low proficiency list (agents they can use all right on a given map)
- **teamMapList** = List of **playerObj**s
- **traitList** = List of traits (aka roles) ordered by their importance for an ideal team composition

<ins>Procedure:</ins>
1) Each player gets coverted into a **playerObj** and placed into the **teamMapList**
2) The **teamMapList** is sorted, those with lower total proficiencies (meaning they can use fewer agents) are put at the front of the list
3) For each **playerObj** in **teamMapList**:
    - Check player's high proficiency list for any agent that has current trait
    - Check player's low proficiency list for any agent that has current trait
    - Else, increment the current trait index and repeat
4) Once a match is found, the **playerObj** is removed from the **teamMapList** and turned into a **pairObj** with chosen agent
5) Repeat steps 3) to 4) with the rest of the **teamMapList** until empty
6) Once algorithm is complete, user is left with 5 **pairObjs** that represent each player and the agent they will use

## 🚀 Potential Features for the Future
- Locking player-agents pairs in teambuilder
- Filter for player list
- Custom Tags for player list for organization

## 📓 Resources Used
Project Foundation:
https://www.youtube.com/watch?v=PppslXOR7TA

General Information:
https://www.w3schools.com/

React Hooks:
https://www.youtube.com/watch?v=V9i3cGD-mts&list=PLApy4UwQM3UrZsBTY111R6P4frt6WK-G2

Database Design:
https://www.youtube.com/watch?v=lgiQLBwPmTQ

SQLAlchemy Relationships:
https://docs.sqlalchemy.org/en/20/orm/relationships.html

dnd-kit:
https://codesandbox.io/p/sandbox/dnd-kit-multi-containers-lknfe?file=%2Fsrc%2Fapp.js

