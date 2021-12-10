<template>
  <div class="wrapper">
    <div>
      <h1>ARENA</h1>
      <span>Arena Tier: {{ characterInformation.tier || '-' }}</span>
      <br/>
      <span>Wager Left: {{ formattedWager || '-' }}</span>
    </div>
    <div class="bottom">
      <div class="characterWrapper">
        <div class="traitWrapper">
          <img :src="getCharacterTraitUrl" alt="element" />
        </div>
        <div class="characterImageWrapper">
          <!-- <pvp-character :characterId="currentCharacterId" /> -->
        </div>
        <div class="info">
          <h1 class="characterName">{{ characterInformation.name }}</h1>
          <div class="infoDetails">
            <span>Level: {{ characterInformation.level }}</span>
            <pvp-separator vertical class="separator" />
            <span>Rank: {{ characterInformation.rank }}</span>
          </div>
        </div>
        <div class="weapons">
          <pvp-weapon
            v-if="activeWeaponWithInformation.weaponId"
            :stars="activeWeaponWithInformation.information.stars + 1"
            :element="activeWeaponWithInformation.information.element"
            :weaponId="activeWeaponWithInformation.weaponId"
          />
          <pvp-shield
            v-if="activeShieldWithInformation.shieldId"
            :stars="activeShieldWithInformation.information.stars + 1"
            :element="activeShieldWithInformation.information.element"
            :shieldId="activeShieldWithInformation.shieldId"
          />
        </div>
      </div>
      <div class="middleButtons">
        <p>
          DECISION TIME: {{ this.loading ? '...' : this.decisionTimeLeft}}
        </p>
        <button v-if="isCharacterInDuelQueue">IN-PROGRESS</button>
        <div v-else>
          <button v-if="!hasPendingDuel" @click="findMatch" :disabled="loading">Find match</button>
          <button v-else @click="preparePerformDuel" :disabled="loading || !decisionTimeLeft || isCharacterInDuelQueue">DUEL</button>
        </div>
        <button @click="reRollOpponent" :disabled="loading || !hasPendingDuel || isCharacterInDuelQueue">
          Re-roll Opponent {{ formattedReRollCost }} $SKILL
        </button>
        <button @click="leaveArena" :disabled="loading">Leave arena</button>
        <pvp-button buttonText="FIND MATCH" />
        <pvp-button
          buttonText="Re-roll Opponent"
          buttonsubText="0.05 $SKILL"
          :secondary="true"
        />
        <pvp-button
          buttonText="Leave Arena"
          buttonsubText="0.5 $SKILL"
          :secondary="true"
        />
      </div>
      <div class="characterWrapper">
        <div class="traitWrapper">
          <!-- <img :src="getOpponentTraitUrl" alt="element" /> -->
        </div>
        <div class="characterImageWrapper">
          <!-- <pvp-character character="character0" /> -->
        </div>
        <div class="info">
          <h1 class="characterName">{{ opponentInformation.name }}</h1>
          <div class="infoDetails">
            <span>Level: {{ opponentInformation.level }}</span>
            <pvp-separator vertical class="separator" />
            <span>Rank: {{ opponentInformation.rank }}</span>
          </div>
        </div>
        <div class="weapons">
          <pvp-weapon
            v-if="opponentActiveWeaponWithInformation.weaponId"
            :stars="opponentActiveWeaponWithInformation.information.stars + 1"
            :element="opponentActiveWeaponWithInformation.information.element"
            :weaponId="opponentActiveWeaponWithInformation.weaponId"
          />
          <pvp-shield
            v-if="opponentActiveShieldWithInformation.shieldId"
            :stars="opponentActiveShieldWithInformation.information.stars + 1"
            :element="opponentActiveShieldWithInformation.information.element"
            :shieldId="opponentActiveShieldWithInformation.shieldId"
          />
        </div>
      </div>
    </div>
    <!-- TODO: Delete this -->
    <br/>
    <button @click="goBackToSummary" :disabled="loading">BACK TO ARENA SUMMARY</button>
  </div>
</template>

<script>
// import PvPCharacter from '../../components/PvPCharacter.vue';
import BN from 'bignumber.js';
import { mapState } from 'vuex';
import PvPWeapon from '../../components/PvPWeapon.vue';
import PvPShield from '../../components/PvPShield.vue';
import PvPSeparator from '../../components/PvPSeparator.vue';
import PvPButton from '../../components/PvPButton.vue';
import fireIcon from '../../../../../assets/elements/fire.png';
import waterIcon from '../../../../../assets/elements/water.png';
import earthIcon from '../../../../../assets/elements/earth.png';
import lightningIcon from '../../../../../assets/elements/lightning.png';

export default {
  inject: ['web3'],

  components: {
    'pvp-weapon': PvPWeapon,
    'pvp-shield': PvPShield,
    // 'pvp-character': PvPCharacter,
    'pvp-separator': PvPSeparator,
    'pvp-button': PvPButton,
  },

  props: {
    characterInformation: {
      default: {
        tier: null,
        name: '',
        level: null,
        power: null,
        rank: null,
        element: null
      }
    },
    activeWeaponWithInformation: {
      default: {
        weaponId: null,
        information: {}
      }
    },
    activeShieldWithInformation: {
      default: {
        shieldId: null,
        information: {}
      }
    },
    opponentInformation: {
      default: {
        element: '',
        name: '',
        level: null,
        rank: null
      }
    },
    opponentActiveWeaponWithInformation: {
      default: {
        weaponId: null,
        information: {}
      }
    },
    opponentActiveShieldWithInformation: {
      default: {
        shieldId: null,
        information: {}
      }
    },
  },

  data() {
    return {
      loading: true,
      hasPendingDuel: false,
      decisionTimeLeft: 0,
      isWithinDecisionTime: false,
      wager: null,
      duelCost: null,
      reRollCost: null,
      duel: {
        attackerID: null,
        defenderID: null,
        createdAt: null,
        isPending: null
      },
      duelQueue: [],
      isCharacterInDuelQueue: false,
    };
  },

  computed: {
    ...mapState(['contracts', 'currentCharacterId', 'defaultAccount']),

    formattedWager() {
      return new BN(this.wager).div(new BN(10).pow(18)).toFixed(2);
    },

    formattedDuelCost() {
      return new BN(this.duelCost).div(new BN(10).pow(18)).toFixed(2);
    },

    formattedReRollCost() {
      return new BN(this.reRollCost).div(new BN(10).pow(18)).toFixed(2);
    },

    getCharacterTraitUrl() {
      if (this.characterTrait === 'Fire') {
        return fireIcon;
      }
      if (this.characterTrait === 'Water') {
        return waterIcon;
      }
      if (this.characterTrait === 'Earth') {
        return earthIcon;
      }
      return lightningIcon;
    },

    getOpponentTraitUrl() {
      if (this.opponent.trait === 'fire') {
        return fireIcon;
      }
      if (this.opponent.trait === 'water') {
        return waterIcon;
      }
      if (this.opponent.trait === 'earth') {
        return earthIcon;
      }
      return lightningIcon;
    },
  },

  methods: {
    // TODO: delete this
    goBackToSummary() {
      this.$emit('goBackToSummary');
    },

    async leaveArena() {
      this.loading = true;
      try {
        await this.contracts().PvpArena.methods.withdrawFromArena(this.currentCharacterId).send({ from: this.defaultAccount });
        // TODO: Redirect to preparation view
      } catch (err) {
        console.log('leave arena error: ', err);
      }

      this.loading = false;
    },

    async findMatch() {
      this.loading = true;
      try {
        await this.contracts().PvpArena.methods.requestOpponent(this.currentCharacterId).send({ from: this.defaultAccount });
      } catch (err) {
        console.log('find match error: ', err);
      }

      this.duel = await this.contracts().PvpArena.methods.duelByAttacker(this.currentCharacterId).call();

      this.loading = false;
    },

    async reRollOpponent() {
      this.loading = true;
      try {
        await this.contracts().SkillToken.methods
          .approve(this.contracts().PvpArena.options.address, `${this.reRollCost}`).send({ from: this.defaultAccount });

        await this.contracts().PvpArena.methods.reRollOpponent(this.currentCharacterId).send({ from: this.defaultAccount });
      } catch (err) {
        console.log('reroll opponent error: ', err);
        this.loading = false;
        return;
      }

      this.duel = await this.contracts().PvpArena.methods.duelByAttacker(this.currentCharacterId).call();

      this.loading = false;
    },

    async preparePerformDuel() {
      try {
        await this.contracts().PvpArena.methods.preparePerformDuel(this.currentCharacterId).call({from: this.defaultAccount});
      } catch (err) {
        console.log('prepare perform duel error: ', err);
      }

      this.duelQueue = await this.contracts().PvpArena.methods.getDuelQueue().call({from: this.defaultAccount});

      this.isCharacterInDuelQueue = true;
    }
  },

  async created() {
    // TODOS:
    // * [x] Is player in an active duel
    // * [ ] Is player waiting for a duel to process
    // * [x] Reroll opponent
    // * [x] Find match functionality
    // * [x] Leave arena functionality
    this.hasPendingDuel = await this.contracts().PvpArena.methods.hasPendingDuel(this.currentCharacterId).call();

    this.duelQueue = await this.contracts().PvpArena.methods.getDuelQueue().call({from: this.defaultAccount});

    if (this.duelQueue.includes(this.currentCharacterId)) {
      this.isCharacterInDuelQueue = true;
    }

    // TODO: use this
    this.isWithinDecisionTime = await this.contracts().PvpArena.methods.isCharacterWithinDecisionTime(this.currentCharacterId).call();

    this.decisionSeconds = await this.contracts().PvpArena.methods.decisionSeconds().call();

    this.wager = await this.contracts().PvpArena.methods.getCharacterWager(this.currentCharacterId).call({ from: this.defaultAccount });

    this.duelCost = await this.contracts().PvpArena.methods.getDuelCost(this.currentCharacterId).call({ from: this.defaultAccount });

    this.reRollCost = this.duelCost * ((await this.contracts().PvpArena.methods.reRollFeePercent().call({ from: this.defaultAccount })) / 100);

    if (this.hasPendingDuel) {
      const timeNow = Math.floor((new Date()).getTime() / 1000);

      this.duel = await this.contracts().PvpArena.methods.duelByAttacker(this.currentCharacterId).call();

      this.decisionTimeLeft = (this.decisionSeconds - (timeNow - this.duel.createdAt), 0);

      this.timer = setInterval(() => {
        if (this.hasPendingDuel) {
          const timeNow = Math.floor((new Date()).getTime() / 1000);
          this.decisionTimeLeft = Math.max(this.decisionSeconds - (timeNow - this.duel.createdAt), 0);
        }
      }, 1000);

    } else {
      this.duel = {
        attackerID: null,
        defenderID: null,
        createdAt: null,
        isPending: null
      };

      this.decisionTimeLeft = 0;
    }

    this.duelQueue = await this.contracts().PvpArena.methods.getDuelQueue().call({from: this.defaultAccount});

    this.loading = false;
  },

  watch: {
    async duel(value) {
      this.loading = true;

      if (value.defenderID) {
        this.$emit('updateOpponentInformation', value.defenderID);
      } else {
        this.$emit('clearOpponentInformation');
      }

      this.loading = false;
    },
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-top: 3.5rem;
  background-color: #141414;
}

.bottom {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  border: 1px solid red;

  .traitWrapper {
    position: absolute;
    display: flex;
    height: 2.5rem;
    width: 2.5rem;
    top: -5.35%;
    left: 0;
    right: 0;
    padding: 0.4rem;
    transform: rotate(45deg);
    border: 1px solid #edcd90;
    margin-right: auto;
    margin-left: auto;
    background-color: #000000;

    img {
      transform: rotate(-45deg);
    }
  }
}
.characterWrapper,
.middleButtons {
  display: flex;
  height: 24rem;
  justify-content: flex-end;

  button:nth-of-type(2) {
    margin-top: 2rem;
    margin-bottom: 1.5rem;
  }
}
.characterWrapper {
  position: relative;
  flex-direction: column;
  width: 35%;
  background-color: #000;
  border: 1px solid #cec198;

  @media screen and (min-width: 1240px) {
    width: 30%;
  }

  @media screen and (min-width: 1440px) {
    width: 25%;
  }

  @media screen and (min-width: 1680px) {
    width: 20%;
  }

  @media screen and (min-width: 2560px) {
    width: 15%;
  }

  .characterImageWrapper {
    display: flex;
    margin-right: auto;
    margin-left: auto;
    width: 55%;
    height: 55%;
    margin-bottom: 7rem;
  }

  .info {
    position: absolute;
    bottom: 0;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    color: #ffffff;
    margin-bottom: 2.5rem;

    .characterName {
      margin-bottom: 0.3rem;
      color: #cec198;
      font-size: 1.25rem;
      line-height: 1.75rem;
    }
    .infoDetails {
      height: 1.25rem;
      display: flex;
      align-items: center;
      vertical-align: middle;
      font-size: 0.875rem;
      line-height: 1.25rem;

      .separator {
        margin-right: 1.25rem;
        margin-left: 1.25rem;
      }
    }
  }
  .weapons {
    position: absolute;
    bottom: -15%;
    display: flex;
    left: 0;
    justify-content: center;
    right: 0;
    margin-right: auto;
    margin-left: auto;

    div:first-of-type {
      margin-right: 1rem;
    }
  }
}
.middleButtons {
  flex-direction: column;
  margin-right: 3rem;
  margin-left: 3rem;
  width: 12rem;

  @media screen and (min-width: 1280px) {
    margin-right: 5rem;
    margin-left: 5rem;
  }
}
</style>




