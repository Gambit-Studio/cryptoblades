<template>
  <div class="wrapper">
    <div class="mainWrapper">
      <div class="arenaSignup">
        <h1 class="title">ARENA SIGNUP</h1>
        <p>Enter the arena and win rewards ($SKILL).</p>
        <div></div>
        <div class="buttonWrapper">
          <pvp-button
            buttonText="ENTER ARENA"
          />
        </div>
        <div class="bottomWrapper">
          <div class="bottomWrapperNav">
            <button @click="setTab(0)" :class="activeTab === 0 && 'active'">Equipment</button>
            <button @click="setTab(1)" :class="activeTab === 1 && 'active'">Duel history</button>
          </div>
          <div class="bottomWrapperInner">
            <div v-if="activeTab === 0" class="bottomWeapons">
              <!-- <pvp-weapon :stars="5" element="water" />
              <pvp-weapon :stars="2" element="lightning" /> -->
              eqsd
            </div>
            <div v-if="activeTab === 1" class="bottomDuels">
              <ul>
                <li>Date</li>
                <li>22/11/2021</li>
                <li>22/11/2021</li>
                <li>22/11/2021</li>
                <li>22/11/2021</li>
              </ul>
              <ul>
                <li>Result</li>
                <li>Win</li>
                <li>Lose</li>
                <li>Win</li>
                <li>Win</li>
              </ul>
              <ul>
                <li>MMR</li>
                <li>2000</li>
                <li>1990</li>
                <li>1809</li>
                <li>1790</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="characterImage">
        <!-- <pvp-character character="character1" /> -->
      </div>
      <div class="arenaInformation">
        <h1 class="title">ARENA INFORMATION</h1>
        <div class="tokenCard">
          <img src="../../../../assets/skillToken.png" alt="skill token" />
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
import PvPButton from '../components/PvPButton.vue';
// import PvPWeapon from '../components/PvPWeapon.vue';
// import PvpCharacter from "./components/base/PvpCharacter.vue";

export default {
  components: {
    'pvp-button': PvPButton,
    // 'pvp-character': PvpCharacter,
    // 'pvp-weapon': PvPWeapon
  },
  props: {},
  data() {
    return {
      activeTab: 0,
      sword: {},
      shield: {}, //optional shield retrieved from the character
    };
  },
  methods: {
    setTab(tabNumber) {
      this.activeTab = tabNumber;
    }
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #141414;
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
  .buttonWrapper {
    margin-top: 2.25rem;
  }
}
.bottomWrapper {
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 4rem;

  .bottomWrapperNav {
    display: flex;
    border-bottom: 1px solid #363636;

  button {
    display: flex;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    align-items: center;
    vertical-align: middle;
    color: #b4b0a7;
    font-size: 0.875rem;
    line-height: 1.25rem;
    border-bottom: 2px solid transparent;
    border-right: none;
    border-left: none;
    border-top: none;
    background-color: transparent;
    img {
      width: 1rem;
      height: 1rem;
      margin-right: 0.5rem;
    }
    :hover {
      cursor: pointer;
    }
    &.active {
      color: #CEC198;
      border-bottom: 2px solid #CEC198;
    }
  }

  button:first-of-type {
    margin-right: 2rem;
  }
  }

  .bottomWrapperInner {
    padding-top: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #363636;
  }

  .bottomWeapons {
    display: flex;

    div:first-of-type {
      margin-right: 1rem;
    }
  }
  .bottomDuels {
    display: flex;
    justify-content: space-between;

    ul {
      margin-bottom: 0;
      padding-left: 0;
      list-style-type: none;

      li {
        color: #b4b0a7;

        &.lose {
          color: red;
        }
        &.win {
          color: green;
        }
      }
      li:first-of-type {
        color: white;
        margin-bottom: 1rem;
      }
    }
  }
}

.characterImage {
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
    padding: 0;

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
</style>
