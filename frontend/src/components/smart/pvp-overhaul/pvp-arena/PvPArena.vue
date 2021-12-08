<template>
  <div>
    <div v-if="loading">
      LOADING!
    </div>
    <div v-else>
      <pvp-arena-preparation
        v-if="!isCharacterInArena"
        :characterName="nombredelweon"
        :characterLevel="999"
        :characterRanking="1"
        :characterArt="fotodelweon"
      />
      <pvp-arena-summary
        v-if="isCharacterInArena"
        :characterName="nombredelweon"
        :characterLevel="999"
        :characterRanking="1"
      />
      <pvp-arena-matchmaking
        v-if="false"
        :characterName="nombredelweon"
        :characterLevel="999"
        :characterRanking="1"
      />
    </div>
  </div>
</template>

<script>
import { getCharacterNameFromSeed } from '@/character-name';
import { mapState, mapGetters } from 'vuex';
import PvPArenaPreparation from './sub-components/PvPArenaPreparation.vue';
import { getCharacterArt } from '@/character-arts-placeholder';
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
      rankingdelweon: '',
      fotodelweon: ''
    };
  },
  computed: {
    ...mapState(['currentCharacterId', 'contracts', 'defaultAccount']),
    ...mapGetters(['currentCharacter'])
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
      this.fotodelweon = getCharacterArt(this.currentCharacter);
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
      this.nombredelweon = getCharacterNameFromSeed(this.currentCharacterId);
      this.fotodelweon = getCharacterArt(this.currentCharacter);
      this.loading = false;
    }
  }
};
</script>
