<template>
  <div>
    <div v-if="loading">
      LOADING!
    </div>
    <div v-else>
      <div>{{ currentCharacterId }}</div>
      <pvp-arena-preparation v-if="!isCharacterInArena" />
      <!-- <pvp-arena-summary v-if="isCharacterInArena" :characterName="asd"/> -->
      <pvp-arena-matchmaking v-if="false" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PvPArenaPreparation from './sub-components/PvPArenaPreparation.vue';
// import PvPArenaSummary from './sub-components/PvPArenaSummary.vue';
import PvPArenaMatchMaking from './sub-components/PvPArenaMatchMaking.vue';

export default {
  components: {
    'pvp-arena-preparation': PvPArenaPreparation,
    // 'pvp-arena-summary': PvPArenaSummary,
    'pvp-arena-matchmaking': PvPArenaMatchMaking
  },

  data() {
    return {
      loading: true,
      isCharacterInArena: false,
      isMatchMaking: false,
    };
  },

  computed: {
    ...mapState(['currentCharacterId', 'contracts', 'defaultAccount']),
    ...mapGetters([
      'currentCharacter',
      'currentCharacterStamina',
      'getCharacterName',
      'getCharacterStamina',
      'charactersWithIds',
      'ownCharacters',
      'timeUntilCharacterHasMaxStamina',
      'getIsInCombat',
      'getIsCharacterViewExpanded',
      'fightGasOffset',
      'fightBaseline'
    ]),
    asd() {
      return this.getCharacterName(this.currentCharacterId);
    }
  },

  methods: {
  },

  async created() {
    // Note: currentCharacterId can be 0
    if (this.currentCharacterId !== null) {
      if (await this.contracts().PvpArena.methods.isCharacterInArena(this.currentCharacterId).call({ from: this.defaultAccount })) {
        this.isCharacterInArena = true;
      }
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
        } else {
          this.isCharacterInArena = false;
        }
      }

      this.loading = false;
    }
  }
};
</script>
