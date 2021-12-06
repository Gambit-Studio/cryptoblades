<template>
  <div class="pvpWrapper">
    <pvp-nav-bar @changeTab="onChangeTab"/>
    <div v-if="tab === 0">
      <pvp-arena-preparation />
      <pvp-arena-summary />
      <pvp-arena-matchmaking />
    </div>
    <div v-if="tab === 1">LEADERBOARDS</div>
  </div>
</template>

<script>
import PvPArenaPreparation from './arena/PvPArenaPreparation.vue';
import PvPArenaSummary from './arena/PvPArenaSummary.vue';
import PvPArenaMatchMaking from './arena/PvPArenaMatchMaking.vue';
import PvPNavBar from './components/PvPNavBar.vue';

export default {
  components: {
    'pvp-nav-bar': PvPNavBar,
    'pvp-arena-preparation': PvPArenaPreparation,
    'pvp-arena-summary': PvPArenaSummary,
    'pvp-arena-matchmaking': PvPArenaMatchMaking
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