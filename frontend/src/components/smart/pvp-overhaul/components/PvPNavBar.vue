<template>
  <nav>
    <button @click="setTab(0)" :class="activeTab === 0 && 'active'">
      <img src="../../../../assets/swordsIcon.svg"/>
      <span>Arena</span>
    </button>
    <button @click="setTab(1)" :class="activeTab === 1 && 'active'">
      <img src="../../../../assets/crownIcon.svg" />
      <span>Leaderboard</span>
    </button>
  </nav>
</template>

<script>

export default {
  data() {
    return {
      activeTab: Number,
    };
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