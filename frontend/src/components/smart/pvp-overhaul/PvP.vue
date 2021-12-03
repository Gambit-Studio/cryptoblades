<template>
  <div class="pvpWrapper">
    <pvp-nav-bar @changeTab="onChangeTab"/>
    <div v-if="tab === 0">
      <pvp-arena-preparation />
    </div>
    <div v-if="tab === 1">LEADERBOARDS</div>
  </div>
</template>

<script>
import PvPArenaPreparation from './arena/PvPArenaPreparation.vue';
import PvPNavBar from './components/PvPNavBar.vue';

export default {
  components: {
    'pvp-nav-bar': PvPNavBar,
    'pvp-arena-preparation': PvPArenaPreparation
  },

  data() {
    return {
      tab: 0
    };
  },

  methods: {
    onChangeTab(tabNumber) {
      this.tab = tabNumber;
    }
  }
};
</script>

<style scoped lang="scss">
.pvpWrapper {
  padding: 0 4rem;
}
</style>