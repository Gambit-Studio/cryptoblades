<template>
  <div class="pvpCharacterWrapper">
    <img :src="getCharacterImageUrl" alt="character" class="characterImg" />
    <img src="../../../../assets/placeholder/standImage.png" alt="stand" class="characterStand" />
  </div>
</template>

<script>
import { getCharacterArtById } from '../../../../character-arts-placeholder';

export default {
  props: {
    characterId: {
      type: Number,
    },
  },
  computed: {
    getCharacterImageUrl() {
      return getCharacterArtById(this.characterId);
    }
  }
};
</script>

<style scoped lang="scss">
.pvpCharacterWrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.characterImg {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: flex;
}
.characterStand {
  position: absolute;
  bottom: -10%;
  display: flex;
  width: 100%;
}
</style>
