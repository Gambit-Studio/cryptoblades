<template>
  <div class="modalWrapper">
    <div class="modalInnerWrapper">
      <img src="../../../../assets/separatorTop.svg" alt="Top separator">
      <div v-if="result === win" class="modalTitle">You have won the duel!</div>
      <div v-else class="modalTitle"> You have lost the duel!</div>
      <ul>
        <li>
          <span>You Rolled</span>
          <span class="chevron">></span>
          <span>{{ userRoll }}</span>
        </li>
        <pvp-separator />
        <li>
          <span>Opponent rolled</span>
          <span class="chevron">></span>
          <span>{{ opponentRoll }}</span>
        </li>
        <pvp-separator />
      </ul>
      <div class="earnWrapper">You earned: {{ skillEarned }} $SKILL</div>
      <div class="rankWrapper">
        <span>Updated rank: </span>
        <span>{{ userCurrentRank }}</span>
        <span>({{ rankVariation }} Rank)</span>
      </div>
      <img src="../../../../assets/separatorBottom.svg" alt="Bottom separator">
    </div>
    <div class="closeWrapper">
      <p>Tap anywhere to close</p>
      <button><img src="../../../../assets/closeModal.svg" alt="Bottom separator"></button>
    </div>
  </div>
</template>

<script>
import PvPSeparator from '../components/PvPSeparator.vue';

export default {
  components: {
    'pvp-separator': PvPSeparator
  },
  props: {
    result: {
      type: String,
      values: ['win', 'lose']
    },
    userRoll: Number,
    opponentRoll: Number,
    skillEarned: Number,
    rankVariation: Number,
    userCurrentRank: Number
  },
};
</script>

<style scoped lang="scss">
.modalWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  vertical-align: middle;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  border: 1px solid red;
  background-color: rgb(20, 20, 20, 0.5);

  .modalInnerWrapper {
    display: flex;
    width: 90%;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    text-align: center;
    background: transparent linear-gradient(270deg, #00000000 0%, #00000099 28%, #000000 50%, #0000009F 73%, #00000000 100%) 0% 0% no-repeat padding-box;

    @media only screen and (min-width: 1440px) {
      width: 60%;
    }

    @media only screen and (min-width: 1980px) {
      width: 40%;
    }


    img {
      &:first-of-type {
        margin-top: -4rem;

      }
      &:last-of-type {
        margin-bottom: -1rem;
      }
    }

    .modalTitle {
      margin-top: 1rem;
      color: #EDCD90;
      font-size: 2rem;
      line-height: 2.25rem;
    }

    ul {
      display: flex;
      flex-direction: column;
      margin: 1.5rem 0;
      list-style-type: none;
      padding: 0;
      align-items: center;
      justify-content: center;
      width: 50%;

      @media only screen and (min-width: 1440px) {
        width: 30%;
      }

      li {
        display: flex;
        text-align: center;
        padding: 0.5rem 0;
        span {
          display: flex;
          color: #7F8693;
        }
        .chevron {
          margin: 0 1rem;
          font-size: 1.25rem;
        }
      }
    }
    .earnWrapper {
      margin-bottom: 2rem;
      font-size: 1.5rem;
      line-height: 2rem;
      color: #EDCD90;
    }
    .rankWrapper {
      margin-bottom: 2rem;
      span:first-of-type {
        color: white;
      }
      span:nth-of-type(2) {
        margin-right: 0.25rem;
        color: #7F8693;
      }
    }
  }
  .closeWrapper {
    display: flex;
    flex-direction: column;
    margin-top: 2.5rem;
    p{
      color: white;
      font-size: 0.875rem;
      line-height: 1.25rem;
      margin-bottom: .75rem;
    }
    button {
      display: flex;
      background: none;
      border: none;
      width: 2.5rem;
      align-self: center;
      height: 2.5rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>