<template>
  <div class="pvpWrapper">
    <pvp-nav-bar @changeTab="onChangeTab" :isPlayerInArena="this.isPlayerInArena()"/>
    <pvp-arena v-if="tab === 0" @isCharacterInArena="this.isPlayerInArena()"/>
    <pvp-leaderboards v-if="tab === 1" />
  </div>
</template>

<script>
import PvPNavBar from './components/PvPNavBar.vue';
import PvPLeaderboards from './leaderboards/PvPLeaderboards.vue';
import PvPArena from './pvp-arena/PvPArena.vue';

export default {
  components: {
    'pvp-nav-bar': PvPNavBar,
    'pvp-arena': PvPArena,
    'pvp-leaderboards': PvPLeaderboards
  },
  data() {
    return {
      tab: 0,
      isPlayerInArena: Boolean
    };
  },
  methods: {
    // TODO: Use router for this.
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