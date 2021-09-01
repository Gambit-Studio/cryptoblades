const web3 = require("web3");
const { expectRevert, expectEvent, time } = require("@openzeppelin/test-helpers");
const helpers = require("./helpers");

const SkillToken = artifacts.require("SkillToken");
const Characters = artifacts.require("Characters");
const Weapons = artifacts.require("Weapons");
const Shields = artifacts.require("Shields");
const PvpArena = artifacts.require("PvpArena");
const BasicPriceOracle = artifacts.require("BasicPriceOracle");

const { BN } = web3.utils;

contract("PvpArena", (accounts) => {
  let pvpArena, characters, weapons;
  beforeEach(async () => {
    skillToken = await SkillToken.deployed();
    characters = await Characters.deployed();
    weapons = await Weapons.deployed();
    shields = await Shields.deployed();
    pvpArena = await PvpArena.deployed();
    priceOracle = await BasicPriceOracle.deployed();

    await skillToken.transferFrom(skillToken.address, accounts[1], web3.utils.toWei('1', 'kether')); // 1000 skill, test token value is $5 usd
    await skillToken.transferFrom(skillToken.address, accounts[2], web3.utils.toWei('1', 'kether')); // 1000 skill, test token value is $5 usd

    await characters.grantRole(await characters.GAME_ADMIN(), accounts[0]);
    await characters.grantRole(await characters.NO_OWNED_LIMIT(), accounts[1]);
    await weapons.grantRole(await weapons.GAME_ADMIN(), accounts[0]);
    await shields.grantRole(await shields.GAME_ADMIN(), accounts[0]);

    await skillToken.transferFrom(
      skillToken.address,
      accounts[1],
      web3.utils.toWei("10", "ether")
    );
    await skillToken.transferFrom(
      skillToken.address,
      accounts[3],
      web3.utils.toWei("10", "ether")
    );

  });

  describe("#getArenaTier", () => {
    let character0ID;
    let character1ID;

    beforeEach(async () => {
      character0ID = await helpers.createCharacter(accounts[1], "123", {
        characters,
      });
      character1ID = await helpers.createCharacter(accounts[1], "456", {
        characters,
      });

      await helpers.levelUpTo(character0ID, 10, { characters });
      await helpers.levelUpTo(character1ID, 11, { characters });
    });

    it("should return the right arena tier", async () => {
      const character0arenaTier = await pvpArena.getArenaTier(character0ID, {
        from: accounts[1],
      });
      const character1arenaTier = await pvpArena.getArenaTier(character1ID, {
        from: accounts[1],
      });
      expect(character0arenaTier.toString()).to.equal("0");
      expect(character1arenaTier.toString()).to.equal("1");
    });
  });

  describe("#enterArena", () => {
    let characterID;
    let weaponId;
    let shieldId;
    let cost;

    beforeEach(async () => {
      weaponId = await helpers.createWeapon(accounts[1], "123", { weapons });
      shieldId = await helpers.createShield(accounts[1], "123", { shields });
      characterID = await helpers.createCharacter(accounts[1], "123", {
        characters,
      });
    });

    describe("happy path", async () => {
      let enterArenaReceipt;

      beforeEach(async () => {
        cost = await pvpArena.getEntryWager(characterID, { from: accounts[1] });
        await skillToken.approve(pvpArena.address, web3.utils.toWei(cost), {
          from: accounts[1],
        });
        enterArenaReceipt = await pvpArena.enterArena(
          characterID,
          weaponId,
          0,
          false,
          {
            from: accounts[1],
          }
        );
      });

      it("should leave the character temporarily unattackable", async () => {
        let isAttackable = await pvpArena.isCharacterAttackable(characterID);
        const unattackableSeconds = await pvpArena.unattackableSeconds();

        expect(isAttackable).to.equal(false);

        await time.increase(unattackableSeconds);

        isAttackable = await pvpArena.isCharacterAttackable(characterID);
        expect(isAttackable).to.equal(true);
      });

      it("should add the character with its weapon and shield to the arena", async () => {
        const isCharacterInArena = await pvpArena.isCharacterInArena(
          characterID
        );

        expect(isCharacterInArena).to.equal(true);
      });
    });

    describe("character already in arena", () => {
      let weapon2Id;

      beforeEach(async () => {
        await helpers.createWeapon(accounts[1], "123", { weapons });
        weapon2Id = await helpers.createWeapon(accounts[1], "123", { weapons });
        characterID = await helpers.createCharacter(accounts[1], "123", {
          characters,
        });
        pvpArena.enterArena(characterID, weaponId, 0, false, {
          from: accounts[1],
        });
      });

      it("should revert", async () => {
        await expectRevert(
          pvpArena.enterArena(characterID, weapon2Id, 0, false, {
            from: accounts[1],
          }),
          "The character is already in the arena"
        );
      });
    });

    describe("weapon already in arena", () => {
      beforeEach(async () => {
        character2Id = await helpers.createCharacter(accounts[1], "443", {
          characters,
        });

        cost = await pvpArena.getEntryWager(characterID, { from: accounts[1] });

        await skillToken.approve(pvpArena.address, web3.utils.toWei(cost), {
          from: accounts[1],
        });
        await pvpArena.enterArena(characterID, weaponId, 0, false, {
          from: accounts[1],
        });
      });

      it("should revert", async () => {
        cost = await pvpArena.getEntryWager(character2Id, {
          from: accounts[1],
        });
        await skillToken.approve(pvpArena.address, web3.utils.toWei(cost), {
          from: accounts[1],
        });

        await expectRevert(
          pvpArena.enterArena(character2Id, weaponId, 0, false, {
            from: accounts[1],
          }),
          "The weapon is already in the arena"
        );
      });
    });

    describe("shield already in arena", () => {
      beforeEach(async () => {
        character2Id = await helpers.createCharacter(accounts[1], "152", {
          characters,
        });

        weapon2Id = await helpers.createWeapon(accounts[1], "123", { weapons });
        shieldId = await helpers.createShield(accounts[1], "446", { shields });

        cost = await pvpArena.getEntryWager(character2Id, {
          from: accounts[1],
        });
        await skillToken.approve(pvpArena.address, web3.utils.toWei(cost), {
          from: accounts[1],
        });
        await pvpArena.enterArena(characterID, weaponId, shieldId, true, {
          from: accounts[1],
        });
      });

      it("should revert", async () => {
        cost = await pvpArena.getEntryWager(character2Id, {
          from: accounts[1],
        });
        await skillToken.approve(pvpArena.address, web3.utils.toWei(cost), {
          from: accounts[1],
        });

        await expectRevert(
          pvpArena.enterArena(character2Id, weapon2Id, shieldId, true, {
            from: accounts[1],
          }),
          "The shield is already in the arena"
        );
      });
    });

    describe("character is not sender's", () => {
      let otherCharacterId;

      beforeEach(async () => {
        otherCharacterId = await helpers.createCharacter(accounts[2], "123", {
          characters,
        });

        cost = await pvpArena.getEntryWager(characterID, {
          from: accounts[1],
        });

        await skillToken.approve(pvpArena.address, web3.utils.toWei(cost), {
          from: accounts[1],
        });
      });

      it("should revert", async () => {
        await expectRevert(
          pvpArena.enterArena(otherCharacterId, weaponId, 0, false, {
            from: accounts[1],
          }),
          "You don't own the given character"
        );
      });
    });

    describe("character is in a raid", () => {
      it("should revert", () => {});
    });

    describe("weapon is in a raid", () => {
      it("should revert", () => {});
    });
  });

  describe("#getMyParticipatingCharacters", () => {
    let character1ID;
    let character2Id;

    beforeEach(async () => {
      character1ID = await helpers.createCharacter(accounts[3], "123", {
        characters,
      });
      const weapon1Id = await helpers.createWeapon(accounts[3], "125", {
        weapons,
      });
      character2Id = await helpers.createCharacter(accounts[3], "125", {
        characters,
      });
      const weapon2Id = await helpers.createWeapon(accounts[3], "123", {
        weapons,
      });

      cost = await pvpArena.getEntryWager(character1ID, {
        from: accounts[3],
      });
      await skillToken.approve(pvpArena.address, web3.utils.toWei(cost), {
        from: accounts[3],
      });
      await pvpArena.enterArena(character1ID, weapon1Id, 0, false, {
        from: accounts[3],
      });
      cost = await pvpArena.getEntryWager(character2Id, {
        from: accounts[3],
      });
      await skillToken.approve(pvpArena.address, web3.utils.toWei(cost), {
        from: accounts[3],
      });
      await pvpArena.enterArena(character2Id, weapon2Id, 0, false, {
        from: accounts[3],
      });
    });

    it("should return the ids of the characters I have in the arena", async () => {
      const myParticipatingCharacters =
        await pvpArena.getMyParticipatingCharacters({ from: accounts[3] });

      expect(myParticipatingCharacters[0].toString()).to.equal(
        character1ID.toString()
      );
      expect(myParticipatingCharacters[1].toString()).to.equal(
        character2Id.toString()
      );
    });
  });

  describe("#leaveArena", () => {});

  describe("#requestOpponent", () => {
    let character1ID;
    let weapon1ID;

    beforeEach(async () => {
      character1ID = await helpers.createCharacter(accounts[1], "111", {
        characters,
      });
      weapon1ID = await helpers.createWeapon(accounts[1], "111", {
        weapons,
      });
    });

    describe("finding opponents", () => {
      let character2ID;
      let weapon2ID;

      beforeEach(async () => {
        character2ID = await helpers.createCharacter(accounts[1], "222", {
          characters,
        });
        weapon2ID = await helpers.createWeapon(accounts[1], "222", {
          weapons,
        });
        character3ID = await helpers.createCharacter(accounts[2], "333", {
          characters,
        });
        weapon3ID = await helpers.createWeapon(accounts[2], "333", {
          weapons,
        });

        // Make character3 be in a separate tier
        await helpers.levelUpTo(character3ID, 21, { characters });

        const cost1 = await pvpArena.getEntryWager(character1ID, {
          from: accounts[1],
        });
        const cost2 = await pvpArena.getEntryWager(character2ID, {
          from: accounts[1],
        });
        const cost3 = await pvpArena.getEntryWager(character1ID, {
          from: accounts[2],
        });

        await skillToken.approve(pvpArena.address, web3.utils.toWei(cost1), {
          from: accounts[1],
        });
        await skillToken.approve(pvpArena.address, web3.utils.toWei(cost3), {
          from: accounts[2],
        });

        await pvpArena.enterArena(character1ID, weapon1ID, 0, false, {
          from: accounts[1],
        });

        await skillToken.approve(pvpArena.address, web3.utils.toWei(cost2), {
          from: accounts[1],
        });
        await pvpArena.enterArena(character2ID, weapon2ID, 0, false, {
          from: accounts[1],
        });

        await pvpArena.enterArena(character3ID, weapon3ID, 0, false, {
          from: accounts[2],
        });
      });

      it.only("should only pick characters from the same tier", async () => {
        const  { tx }= await pvpArena.requestOpponent(character1ID, {
          from: accounts[1],
        });

        expectEvent.inTransaction(tx, pvpArena, 'NewDuel', { attacker: character1ID, defender: character2ID });
      });
      it("should not consider the character requesting an opponent");
      it("should not consider characters owned by the sender");
      it('should only consider "attackable" characters');
    });

    describe("character not in the arena", () => {
      it("should revert", async () => {
        await expectRevert(
          pvpArena.requestOpponent(character1ID, { from: accounts[1] }),
          "Character is not in the arena"
        );
      });
    });

    describe("opponent found", () => {
      it("should lock 1 duel's cost from wagered skill");
    });

    describe("no opponent found", () => {
      it("should revert");
    });

    describe("decision time expired", () => {
      it("should revert");
    });
  });
});
