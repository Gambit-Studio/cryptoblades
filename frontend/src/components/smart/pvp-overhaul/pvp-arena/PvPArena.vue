<template>
  <div>
    <div v-if="loading">
      LOADING!
    </div>
    <div v-else>
      <div>{{ currentCharacter }}</div>
      <pvp-arena-preparation v-if="!isCharacterInArena" :characterName="nombredelweon" :characterLevel="999" :characterRanking="1" />
      <pvp-arena-summary v-if="isCharacterInArena" :characterName="nombredelweon" :characterLevel="999" :characterRanking="1" />
      <pvp-arena-matchmaking v-if="false" :characterName="nombredelweon" :characterLevel="999" :characterRanking="1" />
    </div>
  </div>
</template>

<script>
import { getCharacterNameFromSeed } from '@/character-name';
import { mapState } from 'vuex';
import PvPArenaPreparation from './sub-components/PvPArenaPreparation.vue';
// import PvPArenaSummary from './sub-components/PvPArenaSummary.vue';
// import PvPArenaMatchMaking from './sub-components/PvPArenaMatchMaking.vue';

export default {
  components: {
    'pvp-arena-preparation': PvPArenaPreparation,
    // 'pvp-arena-summary': PvPArenaSummary,
    // 'pvp-arena-matchmaking': PvPArenaMatchMaking
  },
  data() {
    return {
      loading: true,
      isCharacterInArena: false,
      isMatchMaking: false,
      nombredelweon: '',
      rankingdelweon: ''
    };
  },
  computed: {
    ...mapState(['currentCharacterId', 'contracts', 'defaultAccount']),
  },
  methods: {
  },
  async created() {
    // Note: currentCharacterId can be 0
    if (this.currentCharacterId !== null) {
      if (await this.contracts().PvpArena.methods.isCharacterInArena(this.currentCharacterId).call({ from: this.defaultAccount })) {
        this.isCharacterInArena = true;
      }
      this.nombredelweon = getCharacterNameFromSeed(this.currentCharacterId);
      // this.rankingdelweon = this.contracts().PvpArena.methods.getCharacterRankingPoints(this.currentCharacterId);
    }

    this.$emit('isCharacterInArena', this.isCharacterInArena);
    this.loading = false;
  },
  watch: {
    async currentCharacterId(value) {
      this.loading = true;

      if (value !== null) {
        if (await this.contracts().PvpArena.methods.isCharacterInArena(value).call({ from: this.defaultAccount })) {
          this.isCharacterInArena = true;
          this.nombredelweon = getCharacterNameFromSeed(this.currentCharacterId);
          // this.rankingdelweon = this.contracts().PvpArena.methods.getCharacterRankingPoints(this.currentCharacterId);
        } else {
          this.isCharacterInArena = false;
        }
      }
      this.loading = false;
    }
  }
};
</script>
