<template>
  <nav>
    <div v-if="isMatchmakingActive" class="qwe">
      <div class="qweTitle">Arena</div>
      <div class="qweStats">
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
    </div>
    <div v-else class="asd">
      <button @click="setTab(0)" :class="activeTab === 0 && 'active'">
        <img src="../../../../assets/swordsIcon.svg"/>
        <span>Arena</span>
      </button>
      <button @click="setTab(1)" :class="activeTab === 1 && 'active'">
        <img src="../../../../assets/crownIcon.svg" />
        <span>Leaderboard</span>
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      activeTab: Number,
    };
  },
  props: {
    isMatchmakingActive: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    return this.activeTab = 0;
  },
  methods: {
    setTab(tabNumber) {
      this.$emit('changeTab', tabNumber);
      this.activeTab = tabNumber;
    }
  }
};
</script>

<style scoped lang="scss">
nav {
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid #363636;

  .asd {
    display: flex;
  }

  .qwe {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #363636;

    .qweTitle {
      color: #cec198;
      font-size: 1.875rem;
      line-height: 2.25rem;
    }
    .qweStats {
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
      color: #ffffff;
      border-bottom: 2px solid #edcd90;
    }
  }

  button:first-of-type {
    margin-right: 2.5rem;
  }
}
</style>