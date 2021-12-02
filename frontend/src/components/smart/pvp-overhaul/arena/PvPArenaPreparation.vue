<template>
  <div class="wrapper">
    <nav>
      <a href="/">
        <img src="./assets/swordsImage.svg" />
        <span>Arena</span>
      </a>
      <a href="/">
        <img src="./assets/crown.svg" />
        <span>Leaderboard</span>
      </a>
    </nav>
    <div class="mainWrapper">
      <div class="arenaSignup">
        <h1 class="title">ARENA SIGNUP</h1>
        <p>Enter the arena and win rewards ($SKILL).</p>
        <div>
          <div class="top">
            <div class="circle">
              <img :src="secondImageSource" alt="check ellipse" />
            </div>
            <p>Equip a Sword and a Shield (optional).</p>
          </div>
          <div class="bottomWeapons">
            <PvPSeparator dark vertical />
            <div class="weaponsWrapper">
              <button class="selectWeaponButton">
                <img src="./assets/swordImage.svg" alt="sword" />
              </button>
              <button class="selectWeaponButton">
                <img src="./assets/shieldImage.svg" alt="shield" />
              </button>
            </div>
          </div>
        </div>
        <div>
          <div class="top">
            <div class="circle">
              <img :src="secondImageSource" alt="check ellipse" />
            </div>
            <p>Enter the Arena</p>
          </div>
          <div class="bottomList">
            <PvPSeparator dark vertical />
            <div class="">
              <ul class="">
                <li>
                  <PvPBulletpoint /> Entering the Arena will cost you 3 $SKILL.
                </li>
                <li>
                  <PvPBulletpoint /> Players can attack you while you are in the
                  Arena.
                </li>
                <li>
                  <PvPBulletpoint /> Leaving the Arena will cost you 1.5 $SKILL.
                </li>
              </ul>
              <label class="checkbox">
                <input type="checkbox" @click="handleAcceptTerms" />
                <span>I understand.</span>
              </label>
            </div>
          </div>
        </div>
        <div class="buttonWrapper">
          <PvPButton
            buttonText="ENTER ARENA"
            buttonsubText="$SKILL: 3"
            :class="{ disabled: !secondCheckToggle }"
            :disabled="secondCheckToggle === false"
          />
        </div>
      </div>
      <div class="characterImage">
        <PvpCharacter character="character3" />
      </div>
      <div class="arenaInformation">
        <h1 class="title">ARENA INFORMATION</h1>
        <div class="tokenCard">
          <img src="./assets/skillTokenImage.png" alt="skill token" />
          <div class="tokenCardInfo">
            <span class="text">PVP Rewards Pool ($SKILL)</span>
            <span class="number">3,099</span>
          </div>
        </div>
        <ul class="topPlayersList">
          <li class="header">
            <span>Top Players</span><span>$SKILL Earned</span>
          </li>
          <li><span>Rank 1: Player1 </span><span>500</span></li>
          <li><span>Rank 2: Player2 </span><span>453</span></li>
          <li><span>Rank 3: Player3 </span><span>182</span></li>
        </ul>
        <a href="/" class="rankings">View all rankings</a>
        <ul class="characterAttrsList">
          <li class="characterName">CEYT QUAL</li>
          <li><span>Power </span><span>500</span></li>
          <li><span>Damage multiplier</span><span>453</span></li>
          <li><span>Level</span><span>182</span></li>
          <li><span>Current rank</span><span>182</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import PvPSeparator from '../components/PvPSeparator.vue';
import PvPBulletpoint from '../components/PvPBulletpoint.vue';
import PvPButton from '../components/PvPButton.vue';
// import PvpCharacter from '../components/PvpCharacter.vue';
// import PvPWeapon from "../components/PvPWeapon.vue";
// import checkImageUrl from './assets/checkImage.svg';
// import ellipseImageUrl from './assets/ellipseImage.svg';

export default {
  components: {
    // PvpCharacter,
    PvPBulletpoint,
    PvPSeparator,
    // PvPWeapon,
    PvPButton,
  },
  props: {},
  data() {
    return {
      sword: {},
      shield: {},
      firstCheckToggle: false,
      secondCheckToggle: false,
      checkUrl: '../../../../assets/checkImage.svg',
      ellipseUrl: '../../../../assets/ellipseImage.svg',
    };
  },
  // computed: {
  //   firstImageSource: function () {
  //     return this.firstCheckToggle ? checkImageUrl : ellipseImageUrl;
  //   },
  //   secondImageSource: function () {
  //     return this.secondCheckToggle ? checkImageUrl : ellipseImageUrl;
  //   },
  // },
  methods: {
    handleAcceptTerms() {
      return (
        (this.secondCheckToggle = !this.secondCheckToggle) &&
        (this.firstCheckToggle = !this.firstCheckToggle)
      );
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  padding: 3rem;
  background-color: #151515;

  @media screen and (min-width: 1280px) {
    padding: 3rem 6rem 3rem 6rem;
  }

  @media screen and (min-width: 1440px) {
    padding: 3rem 10rem 3rem 10rem;
  }

  @media screen and (min-width: 1980px) {
    padding: 3rem 25rem 3rem 25rem;
  }

  @media screen and (min-width: 1980px) {
    padding: 3rem 40rem 3rem 40rem;
  }
}
.mainWrapper {
  display: flex;
  justify-content: space-between;
}
.title {
  margin-bottom: 0.75rem;
  color: #cec198;
  font-size: 1.25rem;
  line-height: 1.75rem;
}
.arenaSignup {
  p {
    color: #b4b0a7;
    font-size: 1rem;
    line-height: 1.5rem;
  }
  .top {
    display: flex;
    margin-top: 1.5rem;
    vertical-align: middle;
    align-items: center;

    .circle {
      display: flex;
      width: 1.75rem;
      height: 1.75rem;
      margin-right: 1rem;
      align-items: center;
      vertical-align: middle;
      justify-content: center;
      border-radius: 9999px;
      border: 2px solid #cec198;
    }
    img {
      height: 0.75rem;
      width: 0.75rem;
    }
    p {
      color: #cec198;
    }
  }
  .bottomWeapons,
  .bottomList {
    display: flex;
    margin-top: 0.75rem;
    margin-left: 0.75rem;
  }
  .bottomWeapons {
    flex-direction: row;
    height: 5rem;

    .weaponsWrapper {
      display: flex;
      flex-direction: row;
      margin-left: 1.75rem;
      margin-top: 0.5rem;

      .selectWeaponButton {
        display: flex;
        width: 4rem;
        height: 4rem;
        align-items: center;
        vertical-align: middle;
        justify-content: center;
        border-radius: 0.375rem;
        border: 1px solid #cec198;

        &:first-of-type {
          margin-right: 1rem;
        }
        img {
          width: 2.25rem;
          height: 2.25rem;
        }
      }
    }
  }
  .bottomList {
    flex-direction: row;
    height: 8rem;

    ul {
      flex-direction: column;
      margin-left: 1.75rem;

      li {
        display: flex;
        margin-bottom: 0.75rem;
        align-items: center;
        vertical-align: middle;
        color: #b4b0a7;
        font-size: 0.875rem;
        line-height: 1.25rem;
      }
    }

    .checkbox {
      display: inline-block;
      align-items: center;
      vertical-align: middle;
      margin-left: 1.75rem;
      margin-top: 1.25rem;

      input {
        height: 1rem;
        width: 1rem;
        border: 1px solid #b4b0a7;
      }

      span {
        margin-left: 0.75rem;
        color: #b4b0a7;
        font-size: 0.875rem;
        line-height: 1.25rem;
      }
    }
  }
  .buttonWrapper {
    margin-top: 2.25rem;
    margin-left: 1.5rem;
  }
}
.characterImage {
  height: 100%;
  width: 33%;
  margin-right: 1rem;
  margin-left: 1rem;
}
.arenaInformation {
  display: flex;
  flex-direction: column;

  .tokenCard {
    display: flex;
    padding: 1rem 2rem 1rem 1.5rem;
    border-radius: 0.375rem;
    align-items: center;
    vertical-align: middle;
    background-color: rgba(0, 0, 0, 0.3);

    img {
      width: 4rem;
      height: 4rem;
    }

    .tokenCardInfo {
      display: flex;
      flex-direction: column;
      margin-left: 1rem;

      .text {
        color: #cec198;
        font-size: 0.875rem;
        line-height: 1.25rem;
      }
      .number {
        color: #ffffff;
        font-size: 1.25rem;
        line-height: 1.75rem;
      }
    }
  }
  .topPlayersList,
  .characterAttrsList {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 1.5rem;

    span {
      color: #b4b0a7;
      font-size: 0.75rem;
      line-height: 1rem;
    }

    span:nth-of-type(2) {
      margin-left: auto;
    }

    li {
      display: flex;
      margin-bottom: 0.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #363636;
    }

    li:first-of-type,
    li:last-of-type {
      padding-bottom: 0;
      border-style: none;
    }
  }
  .topPlayersList {
    .header {
      margin-bottom: 1rem;
      span {
        color: #cec198;
        font-size: 0.875rem;
        line-height: 1.25rem;
      }
    }
  }
  .rankings {
    margin-top: 0.75rem;
    color: #cec198;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  .characterAttrsList {
    margin-top: 2.25rem;
    .characterName {
      margin-bottom: 1rem;
      color: #cec198;
      font-size: 1.25rem;
      line-height: 1.75rem;
    }
  }
}
nav {
  display: flex;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid #363636;

  a {
    display: flex;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    align-items: center;
    vertical-align: middle;
    color: #b4b0a7;
    font-size: 0.875rem;
    line-height: 1.25rem;
    border-bottom: 2px solid transparent;

    img {
      width: 1rem;
      height: 1rem;
      margin-right: 0.5rem;
    }
    :hover {
      cursor: pointer;
    }
  }

  a:active {
    color: #ffffff;
    border-bottom: 2px solid #edcd90;
  }
  a:first-of-type {
    margin-right: 2.5rem;
  }
}
</style>
