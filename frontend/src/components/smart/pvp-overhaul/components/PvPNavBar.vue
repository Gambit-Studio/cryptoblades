<template>
  <nav>
    <button @click="setTab(0)">
      <img :src="swordsUrl"/>
      <span>Arena</span>
    </button>
    <button @click="setTab(1)">
      <img :src="crownUrl" />
      <span>Leaderboard</span>
    </button>
  </nav>
</template>

<script>

export default {
  data() {
    return {
      swordsUrl:'../../../assets/swordsIcon.svg',
      crownUrl:'../../../assets/crownIcon.svg'
    };
  },
  methods: {
    setTab(tabNumber) {
      this.$emit('changeTab', tabNumber);
    }
  }
};
</script>

<style scoped lang="scss">
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