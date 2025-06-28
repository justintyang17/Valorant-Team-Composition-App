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
        agent_role= RoleEnum.DUELIST,
        agent_img="../images/agents/jett.webp"
        )
    
    raze = AgentTable(
        agent_name="Raze",
        agent_role= RoleEnum.DUELIST,
        agent_img="../images/agents/raze.webp"
        )
    reyna = AgentTable(
        agent_name="Reyna",
        agent_role= RoleEnum.DUELIST,
        agent_img="../images/agents/reyna.webp"
    )
    phoenix = AgentTable(
        agent_name="Phoenix",
        agent_role= RoleEnum.DUELIST,
        agent_img="../images/agents/phoenix.webp"
    )
    yoru = AgentTable(
        agent_name="Yoru",
        agent_role= RoleEnum.DUELIST,
        agent_img="../images/agents/yoru.webp"
    )
    neon = AgentTable(
        agent_name="Neon",
        agent_role= RoleEnum.DUELIST,
        agent_img="../images/agents/neon.webp"
    )
    iso = AgentTable(
        agent_name="Iso",
        agent_role= RoleEnum.DUELIST,
        agent_img="../images/agents/iso.webp"
    )
    waylay = AgentTable(
        agent_name="Waylay",
        agent_role= RoleEnum.DUELIST,
        agent_img="../images/agents/waylay.webp"
    )

    db.session.add(jett)
    db.session.add(raze)
    db.session.add(reyna)
    db.session.add(phoenix)
    db.session.add(yoru)
    db.session.add(neon)
    db.session.add(iso)
    db.session.add(waylay)
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
    yoru_flash = AgentTraitTable(
        agent_id = yoru.agent_id,
        trait = TraitEnum.FLASH
    )
    neon_entry = AgentTraitTable(
        agent_id = neon.agent_id,
        trait = TraitEnum.ENTRY
    ) 
    iso_stall = AgentTraitTable(
        agent_id = iso.agent_id,
        trait = TraitEnum.STALL
    ) 
    waylay_entry = AgentTraitTable(
        agent_id = waylay.agent_id,
        trait = TraitEnum.ENTRY
    ) 
    db.session.add(jett_entry)
    db.session.add(raze_entry)
    db.session.add(raze_stall)
    db.session.add(reyna_flash)
    db.session.add(phoenix_flash)
    db.session.add(phoenix_stall)
    db.session.add(yoru_flash)
    db.session.add(neon_entry)
    db.session.add(iso_stall)
    db.session.add(waylay_entry)
    db.session.commit()

# Creates all Initiator entries for Agent table
def initializeInitiators():
    sova = AgentTable(
        agent_name="Sova",
        agent_role= RoleEnum.INITIATOR,
        agent_img="../images/agents/sova.webp"
        )
    fade = AgentTable(
        agent_name="Fade",
        agent_role= RoleEnum.INITIATOR,
        agent_img="../images/agents/fade.webp"
        )
    skye = AgentTable(
        agent_name="Skye",
        agent_role= RoleEnum.INITIATOR,
        agent_img="../images/agents/skye.webp"
        )
    breach = AgentTable(
        agent_name="Breach",
        agent_role= RoleEnum.INITIATOR,
        agent_img="../images/agents/breach.webp"
        )
    kayo = AgentTable(
        agent_name="Kayo",
        agent_role= RoleEnum.INITIATOR,
        agent_img="../images/agents/kayo.webp"
        )
    gekko = AgentTable(
        agent_name="Gekko",
        agent_role= RoleEnum.INITIATOR,
        agent_img="../images/agents/gekko.webp"
        )
    tejo = AgentTable(
        agent_name="Tejo",
        agent_role= RoleEnum.INITIATOR,
        agent_img="../images/agents/tejo.webp"
        )
    db.session.add(sova)
    db.session.add(fade)
    db.session.add(skye)
    db.session.add(breach)
    db.session.add(kayo)
    db.session.add(gekko)
    db.session.add(tejo)
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
    kayo_flash = AgentTraitTable(
        agent_id = kayo.agent_id,
        trait = TraitEnum.FLASH
    )
    kayo_recon = AgentTraitTable(
        agent_id = kayo.agent_id,
        trait = TraitEnum.RECON
    )
    kayo_stall = AgentTraitTable(
        agent_id = kayo.agent_id,
        trait = TraitEnum.STALL
    )
    gekko_recon = AgentTraitTable(
        agent_id = gekko.agent_id,
        trait = TraitEnum.RECON
    )
    gekko_stall = AgentTraitTable(
        agent_id = gekko.agent_id,
        trait = TraitEnum.STALL
    )
    tejo_recon = AgentTraitTable(
        agent_id = tejo.agent_id,
        trait = TraitEnum.RECON
    )
    tejo_stall= AgentTraitTable(
        agent_id = tejo.agent_id,
        trait = TraitEnum.STALL
    )
    db.session.add(sova_recon)
    db.session.add(fade_recon)
    db.session.add(skye_flash)
    db.session.add(skye_recon)
    db.session.add(breach_flash)
    db.session.add(breach_stall)
    db.session.add(kayo_flash)
    db.session.add(kayo_recon)
    db.session.add(kayo_stall)
    db.session.add(gekko_recon)
    db.session.add(gekko_stall)
    db.session.add(tejo_recon)
    db.session.add(tejo_stall)
    db.session.commit()

# Creates all Controller entries for Agent table
def initializeControllers():
    omen = AgentTable(
        agent_name="Omen",
        agent_role= RoleEnum.CONTROLLER,
        agent_img="../images/agents/omen.webp"
        )
    brim = AgentTable(
        agent_name="Brim",
        agent_role= RoleEnum.CONTROLLER,
        agent_img="../images/agents/brim.webp"
        )
    viper = AgentTable(
        agent_name="Viper",
        agent_role= RoleEnum.CONTROLLER,
        agent_img="../images/agents/viper.webp"
        )
    harbour = AgentTable(
        agent_name="Harbour",
        agent_role= RoleEnum.CONTROLLER,
        agent_img="../images/agents/harbour.webp"
        )
    astra = AgentTable(
        agent_name="Astra",
        agent_role= RoleEnum.CONTROLLER,
        agent_img="../images/agents/astra.webp"
        )
    clove = AgentTable(
        agent_name="Clove",
        agent_role= RoleEnum.CONTROLLER,
        agent_img="../images/agents/clove.webp"
        )
    db.session.add(omen)
    db.session.add(brim)
    db.session.add(viper)
    db.session.add(harbour)
    db.session.add(clove)
    db.session.add(astra)
    db.session.flush()

    omen_bsmoke = AgentTraitTable(
        agent_id = omen.agent_id,
        trait = TraitEnum.BALL_SMOKES
    )
    brim_bsmoke = AgentTraitTable(
        agent_id = brim.agent_id,
        trait = TraitEnum.BALL_SMOKES
    )
    brim_stall = AgentTraitTable(
        agent_id = brim.agent_id,
        trait = TraitEnum.STALL
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
    clove_bsmoke = AgentTraitTable(
        agent_id = clove.agent_id,
        trait = TraitEnum.BALL_SMOKES
    )
    astra_bsmoke = AgentTraitTable(
        agent_id = astra.agent_id,
        trait = TraitEnum.BALL_SMOKES
    )
    astra_stall = AgentTraitTable(
        agent_id = astra.agent_id,
        trait = TraitEnum.STALL
    )
    db.session.add(omen_bsmoke)
    db.session.add(brim_bsmoke)
    db.session.add(brim_stall)
    db.session.add(viper_wsmoke)
    db.session.add(viper_stall)
    db.session.add(harbour_wsmoke)
    db.session.add(clove_bsmoke)
    db.session.add(astra_bsmoke)
    db.session.add(astra_stall)
    db.session.commit()

# Creates all Sentinel entries for Agent table
def initializeSentinels():
    sage = AgentTable(
        agent_name="Sage",
        agent_role= RoleEnum.SENTINEL,
        agent_img="../images/agents/sage.webp"
        )
    
    killjoy = AgentTable(
        agent_name="Killjoy",
        agent_role= RoleEnum.SENTINEL,
        agent_img="../images/agents/killjoy.webp"
        )
    cypher = AgentTable(
        agent_name="Cypher",
        agent_role= RoleEnum.SENTINEL,
        agent_img="../images/agents/cypher.webp"
    )
    vyse = AgentTable(
        agent_name="Vyse",
        agent_role= RoleEnum.SENTINEL,
        agent_img="../images/agents/vyse.webp"
    )
    chamber = AgentTable(
        agent_name="Chamber",
        agent_role= RoleEnum.SENTINEL,
        agent_img="../images/agents/chamber.webp"
    )
    deadlock = AgentTable(
        agent_name="Deadlock",
        agent_role= RoleEnum.SENTINEL,
        agent_img="../images/agents/deadlock.webp"
    )

    db.session.add(sage)
    db.session.add(killjoy)
    db.session.add(cypher)
    db.session.add(vyse)
    db.session.add(chamber)
    db.session.add(deadlock)
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
    chamber_trips = AgentTraitTable(
        agent_id = chamber.agent_id,
        trait = TraitEnum.TRIPS
    )
    deadlock_stall = AgentTraitTable(
        agent_id = deadlock.agent_id,
        trait = TraitEnum.STALL
    )

    db.session.add(sage_stall)
    db.session.add(killjoy_stall)
    db.session.add(killjoy_trips)
    db.session.add(cypher_trips)
    db.session.add(vyse_stall)
    db.session.add(vyse_trips)
    db.session.add(chamber_trips)
    db.session.add(deadlock_stall)
    db.session.commit()
