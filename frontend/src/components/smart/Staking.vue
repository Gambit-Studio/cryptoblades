// Taken from https://github.com/SharedStake/SharedStake-ui/blob/8bd7e9873640043dba75c32fdc69d0f6ac8d6fdf/src/components/Stake/Stake.vue

<template>
  <div class="stake">
    <div class="staker">
      <div
        class="reward-claim-section medium-dark-bg"
        :class="{ 'height-minimized': !showRewardClaimSection }"
      >
        <div class="reward-claim-inner-wrapper">
          <h1 class="no-margin center-text">{{$t('stake.rewardsAvailable')}}</h1>
          <p class="center-text">{{$t('stake.have')}}</p>
          <p class="center-text selectable">
            {{ currentRewardEarned.toFixed(18) }} {{stakingRewardsName}}
          </p>
          <p class="center-text">{{$t('stake.toBeClaimed')}}</p>
          <button
            class="StakeButton claim-button"
            :class="{
              switch_active: rewardClaimState === 'ok',
            }"
            @click="onClaimReward"
          >
            {{ claimRewardButtonLabel }}
          </button>
        </div>
      </div>
      <div class="chooser">
        <div class="navbar-staking">
          <button
            class="switch"
            :class="{ switch_active: isDeposit }"
            @click="isDeposit = true"
          >
            <span>{{$t('stake.stake')}}</span>
          </button>
          <button
            class="switch"
            :class="{ switch_active: !isDeposit }"
            @click="isDeposit = false"
          >
            <span>{{$t('stake.unstake')}}</span>
          </button>
        </div>
      </div>
      <div class="stakePage medium-dark-bg">
        <div class="sPElement input overflow">
          <div class="inputBody overflow">
            <div :class="isNftStaking ? 'd-flex align-items-center w-100 overflow' : 'flex_row'">
              <input
                v-if="!isNftStaking"
                class="token-amount-input"
                inputmode="decimal"
                :title="$t('stake.tokenAmount')"
                autocomplete="off"
                autocorrect="off"
                type="text"
                pattern="^[0-9]*[.,]?[0-9]*$"
                placeholder="0.0"
                minlength="1"
                maxlength="39"
                spellcheck="false"
                value=""
                v-model="textAmount"
              />
              <div v-if="isNftStaking" class="mr-2 ml-3">ID(s):</div>
              <multiselect v-if="isNftStaking" class="overflow" v-model="idsToStake"
                :options="(isDeposit ? ownedLandIds : stakedIds).filter(x => +x.tier === +tier || !tier) || []"
                :max="10" :multiple="true" :close-on-select="false" :clear-on-select="false" :placeholder="$t('stake.pickId')"
                :custom-label="idWithTier" track-by="id"
              >
                <template slot="selection" :slot-scope="{ idsToStake }">
                  <span class="multiselect__single" v-if="idsToStake && idsToStake.length">{{ idsToStake.length }} {{$t('stake.idsSelected')}}</span>
                </template>
              </multiselect>
              <div :class="isNftStaking ? 'ml-2 mr-3' : 'ant-col'">{{ stakingTokenName }}</div>
            </div>
            <div class="balance" id="balance" @click="!isNftStaking && onMAX">
              {{$t('stake.wallet')}} {{ inputSideBalance }}
            </div>
          </div>
        </div>

        <div class="down-arrow-spacer"></div>

        <div class="sPElement input">
          <div class="inputBody">
            <div class="flex_row">
              <input
                class="token-amount-input"
                inputmode="decimal"
                :title="$t('stake.tokenAmount')"
                autocomplete="off"
                autocorrect="off"
                type="text"
                pattern="^[0-9]*[.,]?[0-9]*$"
                placeholder="0.0"
                minlength="1"
                maxlength="39"
                spellcheck="false"
                :value="bigNumberAmount.div(1e18)"
                readonly
              />
              <div class="ant-col">
                {{ stakingTokenName }}
              </div>
            </div>
            <div class="balance" id="balance" @click="!isNftStaking && onMAX">
              {{$t('stake.wallet')}} {{ outputSideBalance }}
            </div>
          </div>
        </div>

        <p
          class="no-margin spacing-top"
          v-if="isDeposit && stakeData.rewardMinimumStakeTime > 0"
          v-html="$t('stake.stakeNote', { minimumStakeTimeFormatted})"
        >
        </p>

        <button
          class="btn btn-primary spacing-top"
          :disabled="!(!loading && currentState === 'ok')"
          tagname="stake"
          @click="onSubmit"
        >
          <span v-if="loading">
            <!-- <ImageVue :src="'loading.svg'" :size="'45px'" /> -->
            {{$t('stake.loading')}}
          </span>
          <span class="gold-text" v-else>
            {{ submitButtonLabel }}
            <b-icon-exclamation-circle class="centered-icon" scale="0.9" v-if="tryingToUnstake"
              v-tooltip="$t('stake.lockedNote', {minimumStakeTimeFormatted})"/>
          </span>
        </button>

        <button
          v-if="stakeUnclaimedRewardsButtonShown"
          class="btn btn-primary spacing-top"
          :disabled="!canStakeUnclaimedRewards"
          tagname="stake"
          @click="onStakeUnclaimedRewards"
        >
          <span v-if="loading">
            <!-- <ImageVue :src="'loading.svg'" :size="'45px'" /> -->
            Loading...
          </span>
          <span class="gold-text" v-else-if="canStakeUnclaimedRewards">
            {{$t('stake.stakeAllUnclaimedRewards', {formattedSkillRewards})}}
          </span>
          <span class="gold-text" v-else>
            {{$t('stake.noUnclaimedRewards')}}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { toBN } from '../../utils/common';
import { mapActions, mapState } from 'vuex';
import Vue from 'vue';

import { formatDurationFromSeconds, secondsToDDHHMMSS } from '../../utils/date-time';
import { isStakeType, isNftStakeType } from '../../interfaces/State';
import Multiselect from 'vue-multiselect';


export default Vue.extend({
  props: {
    stakeType: {
      type: String,
      validator(type) {
        return isStakeType(type) || isNftStakeType(type);
      }
    },
    tier: {
      type: Number,
      default: 0
    }
  },

  components: {
    Multiselect
  },

  data() {
    return {
      textAmount: '',
      idsToStake: [],
      isOpen: false,
      isDeposit: true,
      loading: false,
      errorWhenUpdating: null,
      rewardClaimLoading: false,

      stakeUnlockTimeLeftCurrentEstimate: 0,
      stakeRewardDistributionTimeLeftCurrentEstimate: 0,
      ownedLandIds: [],
      stakedIds: []
    };
  },
  async mounted() {
    await this.fetchData();

    if(this.stakeType.startsWith('cbkLand')) {
      await this.updateOwnedLands();
    }

    this.stakeUnlockTimeLeftCurrentEstimate = this.unlockTimeLeftInternal;
    this.stakeRewardDistributionTimeLeftCurrentEstimate = this.rewardDistributionTimeLeftInternal;

    this.stakeRewardProgressInterval = setInterval(async () => {
      await this.fetchStakeDetails({ stakeType: this.stakeType });
    }, 10 * 1000);

    this.secondsInterval = setInterval(() => {
      this.updateEstimates();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.stakeRewardProgressInterval);
    clearInterval(this.secondsInterval);
  },
  computed: {
    ...mapState(['defaultAccount', 'staking', 'skillRewards']),

    stakeData() {
      return this.staking[this.stakeType];
    },

    rewardDistributionTimeLeftInternal() { return this.stakeData.rewardDistributionTimeLeft; },
    unlockTimeLeftInternal() { return this.stakeData.unlockTimeLeft; },

    stakingTokenName() {
      switch(this.stakeType) {
      case 'skill':
      case 'skill2':
      case 'skill90':
      case 'skill180':
        return 'SKILL';
      case 'king':
      case 'king90':
      case 'king180':
        return 'KING';
      case 'lp':
      case 'lp2':
        return 'SKILL-WBNB';
      case 'cbkLandT1':
      case 'cbkLandT2':
      case 'cbkLandT3':
        return 'CBKL';
      default:
        return 'unknown';
      }
    },

    stakingRewardsName() {
      if(this.stakeType.startsWith('king') || this.stakeType.startsWith('cbkLand')) return 'KING';
      return 'SKILL';
    },

    minimumStakeTimeFormatted() {
      return formatDurationFromSeconds(this.stakeData.rewardMinimumStakeTime);
    },

    estimatedUnlockTimeLeftFormatted() {
      return secondsToDDHHMMSS(this.stakeUnlockTimeLeftCurrentEstimate);
    },

    showRewardClaimSection() {
      if (this.rewardClaimState === 'loading') {
        return true;
      }

      return this.currentRewardEarned.gt(0);
    },

    walletBalance() {
      return toBN(this.stakeData.ownBalance);
    },

    stakedBalance() {
      return toBN(this.stakeData.stakedBalance);
    },

    currentRewardEarned() {
      return toBN(this.stakeData.currentRewardEarned).dividedBy(1e18);
    },

    remainingCapacityForDeposit() {
      if (!this.stakeData.remainingCapacityForDeposit) {
        return null;
      }

      return toBN(this.stakeData.remainingCapacityForDeposit);
    },

    remainingCapacityForWithdraw() {
      return toBN(this.stakeData.remainingCapacityForWithdraw);
    },

    contractBalance() {
      return toBN(this.stakeData.contractBalance);
    },

    validator() {
      return null;
    },

    inputSideBalance() {
      const b = this.isDeposit ? this.walletBalance : this.stakedBalance;
      return this.isNftStaking ? b : b.dividedBy(1e18).toFixed(6);
    },

    outputSideBalance() {
      const b = this.isDeposit ? this.stakedBalance : this.walletBalance;
      return this.isNftStaking ? b : b.dividedBy(1e18).toFixed(6);
    },

    currentState() {
      if (!this.defaultAccount || this.errorWhenUpdating) {
        return 'connectWallet';
      }

      if (!this.isDeposit && this.unlockTimeLeftInternal > 0) {
        return 'stakeLocked';
      }

      if (
        this.remainingCapacityForDeposit &&
        this.remainingCapacityForDeposit.eq(0) &&
        this.isDeposit
      ) {
        return 'contractFull';
      }

      if (
        this.remainingCapacityForDeposit &&
        this.bigNumberAmount.gt(this.remainingCapacityForDeposit) &&
        this.isDeposit
      ) {
        return 'amountIsTooBig';
      }

      if (this.textAmount[this.textAmount.length - 1] === '.') {
        return 'waiting';
      }

      if (isStakeType(this.stakeType) && this.textAmount <= 0) {
        return 'inputIsZero';
      }

      if (isNftStakeType(this.stakeType) && this.idsToStake.length === 0) {
        return 'inputIsZero';
      }

      const hasSufficientBalance = this.isDeposit
        ? this.walletBalance.gte(this.bigNumberAmount)
        : this.stakedBalance.gte(this.bigNumberAmount);

      if (!hasSufficientBalance) {
        return 'insufficientBalance';
      }

      if (this.bigNumberAmount.gt(this.contractBalance) && !this.isDeposit) {
        return 'notEnoughFundsInExitPool';
      }

      if (
        this.bigNumberAmount.gt(this.remainingCapacityForWithdraw) &&
        !this.isDeposit
      ) {
        return 'notEnoughFundsInExitPool';
      }

      return 'ok';
    },

    submitButtonLabel() {
      switch (this.currentState) {
      case 'ok':
        return this.isDeposit ? this.$t('stake.stakeButtonLabel') : this.$t('stake.unstakeButtonLabel');
      case 'contractFull':
        return this.$t('stake.contractIsFullButtonLabel');
      case 'amountIsTooBig':
        return this.$t('stake.amountIsTooBigButtonLabel');
      case 'waiting':
        return this.$t('stake.waitingButtonLabel');
      case 'inputIsZero':
        return this.$t('stake.enterAnAmountButtonLabel');
      case 'insufficientBalance':
        return this.$t('stake.insufficientBalanceButtonLabel');
      case 'notEnoughFundsInExitPool':
        return this.$t('stake.notEnoughFundsInExitPoolButtonLabel');
      case 'stakeLocked':
        return this.$t('stake.sorryStake', {estimatedUnlockTimeLeftFormatted : this.estimatedUnlockTimeLeftFormatted});
      default:
        return this.$t('stake.connectToWalletButtonLabel');
      }
    },

    tryingToUnstake() {
      return this.currentState === 'ok' && !this.isDeposit;
    },

    rewardClaimState() {
      if (this.rewardClaimLoading) {
        return 'loading';
      }

      if (this.unlockTimeLeftInternal > 0) {
        return 'rewardLocked';
      }

      return 'ok';
    },

    claimRewardButtonLabel() {
      switch (this.rewardClaimState) {
      case 'loading':
        return this.$t('stake.loading');
      case 'rewardLocked':
        return this.$t('stake.sorryReward', {estimatedUnlockTimeLeftFormatted : this.estimatedUnlockTimeLeftFormatted});
      default:
        return this.$t('stake.claimReward');
      }
    },

    bigNumberAmount: {
      get() {
        if (!this.textAmount) return toBN(0);

        return toBN(this.textAmount).multipliedBy(1e18);
      },
      set(newBnAmount) {
        this.textAmount = newBnAmount.dividedBy(1e18);
      },
    },

    stakeUnclaimedRewardsButtonShown() {
      return false;
      // return stakeTypeThatCanHaveUnclaimedRewardsStakedTo === this.stakeType && this.isDeposit;
    },

    canStakeUnclaimedRewards() {
      return !this.loading && toBN(this.skillRewards).gt(0);
      // return true;
    },

    formattedSkillRewards() {
      const b = toBN(this.skillRewards);
      return b.dividedBy(1e18).toFixed(4);
    },

    isNftStaking() {
      return isNftStakeType(this.stakeType);
    }
  },
  methods: {
    ...mapActions([
      'fetchStakeDetails',
      'stake',
      'stakeNfts',
      'unstake',
      'unstakeNfts',
      'unstakeKing',
      'claimKingReward',
      'stakeUnclaimedRewards',
      'claimReward',
      'getOwnedLandIdsWithTier',
      'getStakedIds'
    ]),

    idWithTier({ id, tier }) {
      return `${id} (${this.$t('stake.tier')} ${tier})`;
    },

    updateEstimates() {
      if (this.stakeUnlockTimeLeftCurrentEstimate > 0) {
        this.stakeUnlockTimeLeftCurrentEstimate--;
      }

      if (this.stakeRewardDistributionTimeLeftCurrentEstimate > 0) {
        this.stakeRewardDistributionTimeLeftCurrentEstimate--;
      }
    },

    async onMAX() {
      if (this.isDeposit) {
        if (
          this.remainingCapacityForDeposit &&
          this.remainingCapacityForDeposit.eq(0)
        ) {
          return;
        }

        this.bigNumberAmount = this.walletBalance;

        if (
          this.remainingCapacityForDeposit &&
          this.bigNumberAmount.gt(this.remainingCapacityForDeposit)
        ) {
          this.bigNumberAmount = toBN(this.remainingCapacityForDeposit);
        }
      } else {
        this.bigNumberAmount = this.stakedBalance;

        if (this.bigNumberAmount.gt(this.remainingCapacityForWithdraw)) {
          this.bigNumberAmount = this.remainingCapacityForWithdraw;
        }

        if (this.bigNumberAmount.gt(this.contractBalance)) {
          this.bigNumberAmount = this.contractBalance;
        }
      }
    },
    async onSubmit() {
      if (this.loading || this.currentState !== 'ok') return;
      const amount = this.bigNumberAmount.toString();

      try {
        this.loading = true;

        if (this.isDeposit) {
          if(this.isNftStaking) {
            await this.stakeNfts({ ids: this.idsToStake.map(x => x.id), stakeType: this.stakeType });
          }
          else {
            await this.stake({ amount, stakeType: this.stakeType });
          }
        } else {
          //unstake
          if(this.stakeType === 'king') {
            await this.unstakeKing({ amount });
          }
          else {
            if(this.isNftStaking) {
              await this.unstakeNfts({ ids: this.idsToStake.map(x => x.id), stakeType: this.stakeType });
            }
            else {
              await this.unstake({ amount, stakeType: this.stakeType });
            }
          }
        }
        if(isNftStakeType(this.stakeType)) {
          await this.updateOwnedLands();
          this.idsToStake = [];
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async onStakeUnclaimedRewards() {
      if (this.loading || !this.canStakeUnclaimedRewards) return;

      try {
        this.loading = true;

        await this.stakeUnclaimedRewards({ stakeType: this.stakeType });
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async onClaimReward() {
      if (this.rewardClaimState !== 'ok') return;

      try {
        this.rewardClaimLoading = true;

        if(this.stakeType === 'king') {
          await this.claimKingReward();
        }
        else {
          await this.claimReward({ stakeType: this.stakeType });
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.rewardClaimLoading = false;
      }
    },
    async fetchData() {
      //balances
      try {
        this.errorWhenUpdating = null;
        this.loading = true;

        await this.fetchStakeDetails({ stakeType: this.stakeType });
      } catch (err) {
        this.errorWhenUpdating = err.message;
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    async updateOwnedLands() {
      this.ownedLandIds = await this.getOwnedLandIdsWithTier();
      this.stakedIds = await this.getStakedIds(this.stakeType);
    }
  },
  watch: {
    rewardDistributionTimeLeftInternal(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.stakeRewardDistributionTimeLeftCurrentEstimate = newValue;
      }
    },
    unlockTimeLeftInternal(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.stakeUnlockTimeLeftCurrentEstimate = newValue;
      }
    },
    textAmount(newValue, oldVal) {
      if (newValue.length > 40) {
        this.textAmount = oldVal;
        return;
      }

      if (newValue[newValue.length - 1] === 0) {
        this.textAmount = newValue;
        return;
      }

      if (
        newValue[newValue.length - 1] === '.' &&
        newValue[newValue.length - 2] !== '.'
      ) {
        return;
      }

      if (isNaN(newValue)) {
        this.textAmount = oldVal;
        return;
      }

      if (!newValue) {
        this.textAmount = 0;
      }
    },
    isDeposit() {
      this.textAmount = '';
      this.idsToStake = [];
    },
    async defaultAccount(newVal) {
      if (newVal) {
        await this.fetchData();
      }
    },
  },
});
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
.stake {
  display: inline-block;
  /* background-image: url(bg-1.png); */
  background-repeat: no-repeat;
  background-position: center;
  min-height: 800px;
}
.staker {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  max-width: 375px;
  width: 100%;
  height: 90%;
  overflow: visible;
  box-shadow: 0 0 50px rgb(0 0 0 / 10%);
  border-radius: 2px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  min-height: 634px;
}
.chooser {
  background-color: rgb(15, 16, 19);
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
}
.navbar-staking {
  display: flex;
  border: 1px solid #3c3c3c;
  box-sizing: border-box;
  border-radius: 100px;
  width: 100%;
}
.switch {
  height: 40px;
  padding: 0 20px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-color: transparent;
  color: #9e8a57;
  border-radius: 100px;
  line-height: 24px;
  box-sizing: border-box;
  white-space: nowrap;
  text-align: center;
  border: 1px solid transparent;
  box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  user-select: none;
  touch-action: manipulation;
  background: linear-gradient(180deg, rgba(31, 31, 34, 1) 0%, rgba(24, 27, 30, 1) 5%, rgba(24, 38, 45, 1) 100%);
}

.stakePage {
  width: calc(100% - 20px);
  padding: 10px;
  height: calc(80% - 20px);
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 0.2fr 1fr 5rem;
  gap: 0px 0px;
  grid-template-areas:
    "."
    "."
    ".";
  justify-content: center;
  align-items: center;
}
.sPElement {
  align-self: center;
  justify-self: center;
  color: #fff;
}
.input {
  border-radius: 4px;
  width: 100%;
  height: 180px;
  max-width: 362px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(15, 16, 19);
  border: none;
  font-weight: 500;
}
.inputBody {
  position: relative;
  height: 100%;
  padding: 0 0 0 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.StakeButton {
  border: 2px solid #6c5f38;
  color: #9e8a57;
  border-radius: 0.1em;
  background: rgb(31,31,34);
  background: linear-gradient(180deg, rgba(31, 31, 34, 1) 0%, rgba(24, 27, 30, 1) 5%, rgba(24, 38, 45, 1) 100%);
}
.claim-button {
  display: block;
  margin: 0 auto;
}
.switch_active {
  border: 2px solid rgb(37, 167, 219);
  color: #9e8a57;
  cursor: pointer;
  font-weight: bold;
  background: linear-gradient(180deg, rgba(31, 31, 34, 1) 0%, rgba(24, 27, 30, 1) 5%, rgba(24, 38, 45, 1) 100%);
}
.switch_active:hover,
.switch:hover {
  transform: scale(0.98);
}
.balance {
  margin-top: 8px;
  font-size: 18px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.3px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: underline;
  z-index: 10;
  cursor: pointer;
  font-weight: bolder;
}
.token-amount-input {
  box-sizing: border-box;
  z-index: 10;
  margin: 0;
  padding: 0;
  font-variant: tabular-nums;
  list-style: none;
  font-feature-settings: "tnum";
  position: relative;
  display: inline-block;
  width: 70%;
  padding: 4px 11px;
  color: #fff;
  background-color: transparent;
  outline-width: 0;
  font-size: 34px;
  line-height: 40px;
  text-align: right;
  height: 40px;
  padding-bottom: 0;
  text-overflow: ellipsis;
  border-radius: 2px;
  border: none;
  touch-action: manipulation;
}
.ant-col {
  box-sizing: border-box;
  display: block;
  box-sizing: border-box;
  width: 50%;
}
.background3,
.background2 {
  /* background-image: url(Eth.png); */
  position: absolute;
  z-index: 0;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  mask-image: radial-gradient(
    circle,
    rgba(0, 0, 0, 1) 20%,
    rgba(0, 0, 0, 0.4) 60%
  );
  opacity: 0.05;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.notification {
  width: 90%;
  padding: 5%;
  color: tomato;
  font-size: 16px;
}
.underline {
  text-decoration: underline;
}
.gauge {
  padding-top: 1rem;
}

.down-arrow-spacer {
  height: 2em;
  background-image: url("../../assets/down.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
}

.flex_row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
}
.flex_column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

.reward-claim-section {
  height: fit-content;
  overflow: hidden;
  /* padding: 10px; */
  transition: height 0.7s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.reward-claim-section > * + * {
  margin-top: 1rem;
}

.reward-claim-inner-wrapper {
  padding: 10px;
}

.spacing-top {
  margin-top: 1.5rem;
}

.center-text {
  text-align: center;
}

.selectable {
  user-select: text;
}

.medium-dark-bg {
  background-color: #181818;
}

.height-minimized {
  height: 0;
}

.gold-text {
  color: #9e8a57;
}

.overflow {
  overflow: visible;
}

</style>
