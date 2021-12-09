<template>
    <div class="arenaPreparationWrapper">
    <div class="mainWrapper">
      <div class="arenaSignup">
        <h1 class="title">ARENA SIGNUP</h1>
        <p>Enter the arena and win rewards ($SKILL).</p>
        <div>
          <div class="top">
            <div class="circle">
              <img :src="getIconSource" />
            </div>
            <p>Equip a Sword and a Shield (optional).</p>
          </div>
          <!-- <div class="temporary">
            <div>
              <h3>WEAPON TITLE</h3>
              <button
                v-for="weaponId in ownedWeaponIds"
                :key="weaponId"
                @click="handleWeaponClick(weaponId)"
                :disabled="ownedWeaponIds.includes(weaponId) && !availableWeaponIds.includes(weaponId)"
              >
              WeaponID: {{ weaponId}}
              </button>
              <br/>
              <span>Weapon: {{ selectedWeaponId }}</span>
            </div>
            <br/>
            <div>
              <h3>SHIELD TITLE</h3>
              <button
                v-for="shieldId in ownedShieldIds"
                :key="shieldId"
                @click="handleShieldClick(shieldId)"
                :disabled="ownedShieldIds.includes(shieldId) && !availableShieldIds.includes(shieldId)"
              >
                Shield ID: {{ shieldId }}
              </button>
              <br/>
              <span>Shield: {{ selectedShieldId }}</span>
            </div>
          </div> -->
          <div class="bottomWeapons">
            <pvp-separator dark vertical />
            <div class="weaponsWrapper">
              <button class="selectWeaponButton">
                <img src="../../../../../assets/swordPlaceholder.svg" alt="sword" />
              </button>
              <button class="selectWeaponButton">
                <img src="../../../../../assets/shieldPlaceholder.svg" alt="shield" />
              </button>
            </div>
          </div>
        </div>
        <div>
          <div class="top">
            <div class="circle">
              <img :src="getIconSource" />
            </div>
            <p>Enter the Arena</p>
          </div>
          <div class="bottomList">
            <pvp-separator dark vertical />
            <div>
              <ul>
                <li>
                  <div class="bulletpoint"></div> Entering the Arena will cost you {{ formattedEntryWager }} $SKILL.
                </li>
                <li>
                  <div class="bulletpoint"></div> Players can attack you while you are in the
                  Arena.
                </li>
                <li>
                  <div class="bulletpoint"></div> Leaving the Arena will cost you {{ +formattedEntryWager / 4 }} $SKILL.
                </li>
              </ul>
              <label class="checkbox">
                <input type="checkbox" v-model="checkBoxAgreed" />
                <span>I understand.</span>
              </label>
            </div>
          </div>
        </div>
        <div class="buttonWrapper">
          <pvp-button
            @click="handleEnterArenaClick()"
            buttonText="ENTER ARENA"
            :buttonsubText="'$SKILL: ' + formattedEntryWager"
            :class="{ disabled: !checkBoxAgreed }"
            :disabled="!checkBoxAgreed"
          />
        </div>
      </div>
      <div class="characterImage">
        <!-- <pvp-character :character="1" /> -->
      </div>
      <div class="arenaInformation">
        <h1 class="title">ARENA INFORMATION</h1>
        <div class="tokenCard">
          <img src="../../../../../assets/skillToken.png" alt="skill token" />
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
          <li class="characterName">{{ characterName }}</li>
          <li><span>Power </span><span>500</span></li>
          <li><span>Damage multiplier</span><span>453</span></li>
          <li><span>Level</span><span>{{ characterLevel }}</span></li>
          <li><span>Current rank</span><span>{{ characterRanking }}</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BN from 'bignumber.js';
import { weaponFromContract as formatWeapon } from '../../../../../contract-models';
import PvPSeparator from '../../components/PvPSeparator.vue';
import PvPButton from '../../components/PvPButton.vue';
// import PvPModal from '../../components/PvPModal.vue';
// import PvPCharacter from '../../components/PvPCharacter.vue';
// import PvPWeapon from '../../components/PvPWeapon.vue';
import checkIcon from '../../../../../assets/checkImage.svg';
import ellipseIcon from '../../../../../assets/ellipseImage.svg';

export default {
  components: {
    // 'pvp-weapon': PvPWeapon,
    // 'pvp-character': PvPCharacter,
    'pvp-button': PvPButton,
    'pvp-separator': PvPSeparator,
    // 'pvp-modal': PvPModal,
  },
  data() {
    return {
      msg: 'hellooo',
      entryWager: null,
      selectedWeaponId: null,
      selectedShieldId: null,
      availableWeaponIds: [],
      availableShieldIds: [],
      checkBoxAgreed: false,
      parentOpenModal: false,
      showModalFromChild: false
    };
  },
  props: {
    characterArt: String,
    characterName: String,
    characterLevel: Number,
    characterRanking: Number,
  },
  computed: {
    ...mapState(['currentCharacterId', 'contracts', 'defaultAccount', 'ownedWeaponIds', 'ownedShieldIds']),

    formattedEntryWager() {
      return new BN(this.entryWager).div(new BN(10).pow(18)).toFixed(0);
    },
    getIconSource () {
      return this.checkBoxAgreed ? checkIcon : ellipseIcon;
    },
  },

  methods: {
    handleWeaponClick(weaponId) {
      this.selectedWeaponId = weaponId;
    },

    handleShieldClick(shieldId) {
      this.selectedShieldId = shieldId;
    },
    openTheModal() {
      return this.parentOpenModal = true;
    },

    async handleEnterArenaClick() {
      if (!this.checkBoxAgreed) {
        alert('Please check the \'I understand\' box to proceed.');
        return;
      }

      if (this.currentCharacterId && this.selectedWeaponId && this.entryWager) {
        const isUsingShield = this.selectedShieldId !== null;
        const shieldId = this.selectedShieldId === null ? 0 : this.selectedShieldId;

        try {
          await this.contracts().SkillToken.methods
            .approve(this.contracts().PvpArena.options.address, this.entryWager)
            .send({
              from: this.defaultAccount
            });
        } catch(err) {
          console.log('Enter Arena Approval Error: ', err);
          return;
        }

        try {
          await this.contracts().PvpArena.methods
            .enterArena(this.currentCharacterId, this.selectedWeaponId, shieldId, isUsingShield)
            .send({
              from: this.defaultAccount
            });
        } catch(err){
          console.log('Enter Arena Error: ', err);
          return;
        }

        // Do something when succesful
        this.checkBoxAgreed = !this.checkBoxAgreed;
      } else {
        console.log('Missing data');
      }
    },
  },

  async created() {
    this.entryWager = await this.contracts().PvpArena.methods.getEntryWager(this.currentCharacterId).call({ from: this.defaultAccount });

    const weaponAvailability = await Promise.all(this.ownedWeaponIds.map(async (weaponId) => {
      return {
        weaponId,
        isInArena: await this.contracts().PvpArena.methods.isWeaponInArena(weaponId).call({ from: this.defaultAccount })
      };
    }));

    this.availableWeaponIds = weaponAvailability.filter(weapon => !weapon.isInArena)
      .map(weapon => weapon.weaponId);

    const shieldAvailability = await Promise.all(this.ownedShieldIds.map(async (shieldId) => {
      return {
        shieldId,
        isInArena: await this.contracts().PvpArena.methods.isShieldInArena(shieldId).call({ from: this.defaultAccount })
      };
    }));

    this.availableShieldIds = shieldAvailability.filter(shield => !shield.isInArena)
      .map(shield => shield.shieldId);

    console.log('SAD: ', formatWeapon('10', await this.contracts().Weapons.methods.get('10').call({ from: this.defaultAccount })));
  }
};
</script>

<style scoped lang="scss">
.arenaPreparationWrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #141414;
}
.temporary {
  border: 1px solid red;
}
.mainWrapper {
  display: flex;
  width: 100%;
  margin: 0 auto;
  justify-content: space-between;
}
.title {
  margin-bottom: 0.75rem;
  color: #cec198;
  font-size: 1.25rem;
  line-height: 1.75rem;
  padding: 0;
}
.arenaSignup {
  p {
    margin-bottom: 0;
    color: #b4b0a7;
    font-size: 1rem;
    line-height: 1.5rem;
  }
  .top {
    display: flex;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
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
    margin-left: 0.75rem;
  }
  .bottomWeapons {
    flex-direction: row;
    height: 5rem;

    .weaponsWrapper {
      display: flex;
      flex-direction: row;
      margin-left: 1.75rem;

      .selectWeaponButton {
        display: flex;
        width: 4rem;
        height: 4rem;
        align-items: center;
        vertical-align: middle;
        justify-content: center;
        border-radius: 0.375rem;
        margin-top: 0.5rem;
        border: 1px solid #cec198;
        background-color: #141414;

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
      padding-left: 2rem;
      padding-top: 0.65rem;

      li {
        display: flex;
        margin-bottom: 0.75rem;
        align-items: center;
        vertical-align: middle;
        color: #b4b0a7;
        font-size: 0.875rem;
        line-height: 1.25rem;
      }
      .bulletpoint {
        height: 0.5rem;
        width: 0.5rem;
        margin-right: 0.75rem;
        background-color: #dabe75;
        transform: rotate(45deg);
      }
    }

    .checkbox {
      display: inline-block;
      align-items: center;
      vertical-align: middle;
      margin-left: 1.75rem;
      margin-top: 1rem;

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
    margin-top: 4rem;
    margin-left: 2.5rem;
  }
}
.characterImage {
  display: flex;
  width: 50%;
  padding: 3rem 0;

  @media only screen and (min-width: 1440px) {
    width: 40%;
    margin: 0;
  }

  @media only screen and (min-width: 1980px) {
    width: 30%;
  }
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

