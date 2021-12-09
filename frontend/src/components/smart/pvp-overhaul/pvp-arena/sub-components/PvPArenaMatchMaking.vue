<template>
  <div class="wrapper">
    <div class="bottom">
      <div class="characterWrapper">
        <div class="traitWrapper">
          <img :src="getCharacterTraitUrl" alt="element" />
        </div>
        <div class="characterImageWrapper">
          <pvp-character :characterId="currentCharacterId" />
        </div>
        <div class="info">
          <h1 class="characterName">{{ characterName }}</h1>
          <div class="infoDetails">
            <span>Level: {{ characterLevel }}</span>
            <pvp-separator vertical class="separator" />
            <span>Rank: {{ characterRank }}</span>
          </div>
        </div>
        <div class="weapons">
          <pvp-weapon :stars="4" element="fire" />
          <pvp-weapon :stars="3" element="water" />
        </div>
      </div>
      <div class="middleButtons">
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
          <h1 class="characterName">OPPONENT NAME</h1>
          <div class="infoDetails">
            <span>Level: OPPONENT LEVEL</span>
            <pvp-separator vertical class="separator" />
            <span>Rank: OPPONENT RANK</span>
          </div>
        </div>
        <div class="weapons">
          <pvp-weapon :stars="4" element="fire" />
          <pvp-weapon :stars="3" element="water" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import PvPCharacter from '../../components/PvpCharacter.vue';
import PvPWeapon from '../../components/PvPWeapon.vue';
import PvPSeparator from '../../components/PvPSeparator.vue';
import PvPButton from '../../components/PvPButton.vue';
import fireIcon from '../../../../../assets/elements/fire.png';
import waterIcon from '../../../../../assets/elements/water.png';
import earthIcon from '../../../../../assets/elements/earth.png';
import lightningIcon from '../../../../../assets/elements/lightning.png';

export default {
  components: {
    // 'pvp-character': PvPCharacter,
    'pvp-weapon': PvPWeapon,
    'pvp-separator': PvPSeparator,
    'pvp-button': PvPButton,
  },
  props: {
    characterId: Number,
    characterName: String,
    characterLevel: Number,
    characterRanking: Number,
    characterTrait: String
  },
  computed: {
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
