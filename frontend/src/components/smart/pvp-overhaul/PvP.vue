<template>
  <div class="pvpWrapper">
    <pvp-nav-bar @changeTab="onChangeTab" :isMatchmakingActive="false" />
    <div v-if="tab === 0">
      <pvp-arena-preparation :character="this.character" :opponent="this.opponent"/>
      <pvp-arena-summary :character="this.character" :opponent="this.opponent"/>
      <pvp-arena-matchmaking :character="this.character" :opponent="this.opponent"/>
    </div>
    <div v-if="tab === 1">
      <pvp-leaderboards />
    </div>
  </div>
</template>

<script>
import PvPArenaPreparation from './arena/PvPArenaPreparation.vue';
import PvPArenaSummary from './arena/PvPArenaSummary.vue';
import PvPArenaMatchMaking from './arena/PvPArenaMatchMaking.vue';
import PvPNavBar from './components/PvPNavBar.vue';
import PvPLeaderboards from './leaderboards/PvPLeaderboards.vue';
// import PvPModal from './components/PvPModal.vue';

export default {
  components: {
    'pvp-nav-bar': PvPNavBar,
    'pvp-arena-preparation': PvPArenaPreparation,
    'pvp-arena-summary': PvPArenaSummary,
    'pvp-arena-matchmaking': PvPArenaMatchMaking,
    'pvp-leaderboards': PvPLeaderboards
    // 'pvp-modal': PvPModal
  },
  data() {
    return {
      tab: 0,
      character: {
        name: 'Dummy Character',
        trait: 'earth',
        level: 55,
        rank: 50,
      },
      opponent: {
        name: 'Dummy Opponent',
        trait: 'fire',
        level: 50,
        rank: 58,
      },
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
  padding: 0 2rem;

  @media screen and (min-width: 1240px) {
    padding: 0 4rem;
  }

  @media screen and (min-width: 1440px) {
    padding: 0 6rem;
  }

  @media screen and (min-width: 1680px) {
    padding: 0 8rem;
  }

  @media screen and (min-width: 2560px) {
    padding: 0 10rem;
  }
}
</style>