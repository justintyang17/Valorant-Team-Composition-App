from flask import request, jsonify
from config import app, db
from models import RankEnum, PlayerProfile, RoleEnum, TraitEnum, AgentTable, AgentTraitTable, MapEnum, PlayerMapTable, MapAgentTable
import re

# Creates all entries for Agent and Trait tables
def initializeAssets():
    if AgentTable.query.first() is None:
        initializeDuelists()
        initializeInitiators()
        initializeControllers()
        initializeSentinels()

# Creates all Duelist entries for Agent and Trait tables
def initializeDuelists():
    jett = AgentTable(
        agent_name="Jett",
        agent_role= RoleEnum.DUELIST
        )
    
    raze = AgentTable(
        agent_name="Raze",
        agent_role= RoleEnum.DUELIST
        )
    reyna = AgentTable(
        agent_name="Reyna",
        agent_role= RoleEnum.DUELIST
    )
    phoenix = AgentTable(
        agent_name="Phoenix",
        agent_role= RoleEnum.DUELIST
    )

    db.session.add(jett)
    db.session.add(raze)
    db.session.add(reyna)
    db.session.add(phoenix)
    db.session.flush()

    jett_entry = AgentTraitTable(
        agent_id = jett.agent_id,
        trait = TraitEnum.ENTRY
    )
    raze_entry = AgentTraitTable(
        agent_id = raze.agent_id,
        trait = TraitEnum.ENTRY
    )
    raze_stall = AgentTraitTable(
        agent_id = raze.agent_id,
        trait = TraitEnum.STALL
    )
    reyna_flash = AgentTraitTable(
        agent_id = reyna.agent_id,
        trait = TraitEnum.FLASH
    )
    phoenix_flash = AgentTraitTable(
        agent_id = phoenix.agent_id,
        trait = TraitEnum.FLASH
    )
    phoenix_stall = AgentTraitTable(
        agent_id = phoenix.agent_id,
        trait = TraitEnum.STALL
    )
    db.session.add(jett_entry)
    db.session.add(raze_entry)
    db.session.add(raze_stall)
    db.session.add(reyna_flash)
    db.session.add(phoenix_flash)
    db.session.add(phoenix_stall)
    db.session.commit()

# Creates all Initiator entries for Agent table
def initializeInitiators():
    sova = AgentTable(
        agent_name="Sova",
        agent_role= RoleEnum.INITIATOR
        )
    fade = AgentTable(
        agent_name="Fade",
        agent_role= RoleEnum.INITIATOR
        )
    skye = AgentTable(
        agent_name="Skye",
        agent_role= RoleEnum.INITIATOR
        )
    breach = AgentTable(
        agent_name="Breach",
        agent_role= RoleEnum.INITIATOR
        )
    db.session.add(sova)
    db.session.add(fade)
    db.session.add(skye)
    db.session.add(breach)
    db.session.flush()

    sova_recon = AgentTraitTable(
        agent_id = sova.agent_id,
        trait = TraitEnum.RECON
    )
    fade_recon = AgentTraitTable(
        agent_id = fade.agent_id,
        trait = TraitEnum.RECON
    )
    skye_recon = AgentTraitTable(
        agent_id = skye.agent_id,
        trait = TraitEnum.RECON
    )
    skye_flash = AgentTraitTable(
        agent_id = skye.agent_id,
        trait = TraitEnum.FLASH
    )
    breach_flash = AgentTraitTable(
        agent_id = breach.agent_id,
        trait = TraitEnum.FLASH
    )
    breach_stall = AgentTraitTable(
        agent_id = breach.agent_id,
        trait = TraitEnum.STALL
    )
    db.session.add(sova_recon)
    db.session.add(fade_recon)
    db.session.add(skye_flash)
    db.session.add(skye_recon)
    db.session.add(breach_flash)
    db.session.add(breach_stall)
    db.session.commit()

# Creates all Controller entries for Agent table
def initializeControllers():
    omen = AgentTable(
        agent_name="Omen",
        agent_role= RoleEnum.CONTROLLER
        )
    brim = AgentTable(
        agent_name="Brim",
        agent_role= RoleEnum.CONTROLLER
        )
    viper = AgentTable(
        agent_name="Viper",
        agent_role= RoleEnum.CONTROLLER
        )
    harbour = AgentTable(
        agent_name="Harbour",
        agent_role= RoleEnum.CONTROLLER
        )
    db.session.add(omen)
    db.session.add(brim)
    db.session.add(viper)
    db.session.add(harbour)
    db.session.flush()

    omen_bsmoke = AgentTraitTable(
        agent_id = omen.agent_id,
        trait = TraitEnum.BALL_SMOKES
    )
    brim_bsmoke = AgentTraitTable(
        agent_id = brim.agent_id,
        trait = TraitEnum.BALL_SMOKES
    )
    viper_wsmoke = AgentTraitTable(
        agent_id = viper.agent_id,
        trait = TraitEnum.WALL_SMOKES
    )
    viper_stall = AgentTraitTable(
        agent_id = viper.agent_id,
        trait = TraitEnum.STALL
    )
    harbour_wsmoke = AgentTraitTable(
        agent_id = harbour.agent_id,
        trait = TraitEnum.WALL_SMOKES
    )

    db.session.add(omen_bsmoke)
    db.session.add(brim_bsmoke)
    db.session.add(viper_wsmoke)
    db.session.add(viper_stall)
    db.session.add(harbour_wsmoke)
    db.session.commit()

# Creates all Sentinel entries for Agent table
def initializeSentinels():
    sage = AgentTable(
        agent_name="Sage",
        agent_role= RoleEnum.SENTINEL
        )
    
    killjoy = AgentTable(
        agent_name="Killjoy",
        agent_role= RoleEnum.SENTINEL
        )
    cypher = AgentTable(
        agent_name="Cypher",
        agent_role= RoleEnum.SENTINEL
    )
    vyse = AgentTable(
        agent_name="Vyse",
        agent_role= RoleEnum.SENTINEL
    )

    db.session.add(sage)
    db.session.add(killjoy)
    db.session.add(cypher)
    db.session.add(vyse)
    db.session.flush()

    sage_stall = AgentTraitTable(
        agent_id = sage.agent_id,
        trait = TraitEnum.STALL
    )
    killjoy_trips = AgentTraitTable(
        agent_id = killjoy.agent_id,
        trait = TraitEnum.TRIPS
    )
    killjoy_stall = AgentTraitTable(
        agent_id = killjoy.agent_id,
        trait = TraitEnum.STALL
    )
    cypher_trips = AgentTraitTable(
        agent_id = cypher.agent_id,
        trait = TraitEnum.TRIPS
    )
    vyse_stall = AgentTraitTable(
        agent_id = vyse.agent_id,
        trait = TraitEnum.STALL
    )
    vyse_trips = AgentTraitTable(
        agent_id = vyse.agent_id,
        trait = TraitEnum.TRIPS
    )

    db.session.add(sage_stall)
    db.session.add(killjoy_stall)
    db.session.add(killjoy_trips)
    db.session.add(cypher_trips)
    db.session.add(vyse_stall)
    db.session.add(vyse_trips)
    db.session.commit()
