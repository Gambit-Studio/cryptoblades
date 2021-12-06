<template>
  <div class="wrapper">
    <header>
      <div class="headerTitle">Arena</div>
      <div class="headerStats">
        <div>
          <span>Arena tier:</span>
          <span>5</span>
        </div>
        <div>
          <span>Wage left:</span>
          <span>2 SKILL</span>
        </div>
        <div>
          <span>Current earnings:</span>
          <span>1.4 SKILL</span>
        </div>
      </div>
    </header>
    <div class="bottom">
      <div class="characterWrapper">
        <div class="elementWrapper">
          <img :src="getCharacterElementUrl" alt="element" />
        </div>
        <div class="characterImageWrapper">
          <!-- <PvpCharacter character="character3" /> -->
        </div>
        <div class="info">
          <h1 class="characterName">{{ character.name }}</h1>
          <div class="infoDetails">
            <span>Level: {{ character.level }}</span>
            <pvp-separator vertical class="separator" />
            <span>Rank: {{ character.rank }}</span>
          </div>
        </div>
        <div class="weapons">
          <!-- <CBWeapon :stars="4" element="fire" />
          <CBWeapon :stars="3" element="water" /> -->
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
        <div class="elementWrapper">
          <img :src="getOpponentElementUrl" alt="element" />
        </div>
        <div class="characterImageWrapper">
          <!-- <PvpCharacter character="character0" /> -->
        </div>
        <div class="info">
          <h1 class="characterName">{{ opponent.name }}</h1>
          <div class="infoDetails">
            <span>Level: {{ opponent.level }}</span>
            <pvp-separator vertical class="separator" />
            <span>Rank: {{ opponent.rank }}</span>
          </div>
        </div>
        <div class="weapons">
          <!-- <CBWeapon :stars="4" element="fire" />
          <CBWeapon :stars="3" element="water" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import PvpCharacter from "./components/base/PvpCharacter.vue";
// import CBWeapon from "./components/base/CBWeapon.vue";
import PvPSeparator from './components/PvPSeparator.vue';
import PvPButton from './components/PvPButton.vue';
// import fire from "../../assets/elements/fire.png";
// import water from "../../assets/elements/water.png";
// import earth from "../../assets/elements/earth.png";
// import lightning from "../../assets/elements/lightning.png";

export default {
  components: {
    // PvpCharacter,
    // CBWeapon,
    'pvp-separator': PvPSeparator,
    'pvp-button': PvPButton,
  },
  props: {
    character: {
      required: true,
    },
    opponent: {
      required: true,
    },
  },
};
//   computed: {
//     getCharacterElementUrl: function () {
//       if (this.character.element === "fire") {
//         return fire;
//       }
//       if (this.character.element === "water") {
//         return water;
//       }
//       if (this.character.element === "earth") {
//         return earth;
//       }
//       return lightning;
//     },
//     getOpponentElementUrl: function () {
//       if (this.opponent.element === "fire") {
//         return fire;
//       }
//       if (this.opponent.element === "water") {
//         return water;
//       }
//       if (this.opponent.element === "earth") {
//         return earth;
//       }
//       return lightning;
//     },
//   },
// };
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  padding: 3rem 3rem 3rem 3rem;
  background-color: #151515;
}
header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #363636;

  .headerTitle {
    color: #cec198;
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
  .headerStats {
    display: flex;

    div:nth-of-type(2) {
      margin-left: 1.25rem;
      margin-right: 1.25rem;
    }

    div {
      display: flex;
      align-items: flex-end;
      font-size: 0.875rem;
      line-height: 1.25rem;

      span:first-of-type {
        margin-right: 0.25rem;
        color: #cec198;
      }
      span:last-of-type {
        color: #ffffff;
      }
    }
  }
}
.bottom {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;

  .elementWrapper {
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
  width: 25%;
  background-color: #000;
  border: 1px solid #cec198;

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
    margin-bottom: 2.2rem;

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
    bottom: -17%;
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
