<template>
  <div class="pvpCharacterWrapper">
    <img :src="getCharacterImageUrl" alt="character" class="characterImg" />
    <img src="../../../../assets/placeholder/standImage.png" alt="stand" class="characterStand" />
  </div>
</template>

<script>
import chara0 from '../../../../assets/placeholder/chara-0.png';
import chara1 from '../../../../assets/placeholder/chara-1.png';
import chara2 from '../../../../assets/placeholder/chara-2.png';
import chara3 from '../../../../assets/placeholder/chara-3.png';

export default {
  props: {
    character: {
      type: String,
    },
  },
  computed: {
    getCharacterImageUrl() {
      if (this.character === 0) {
        return chara0;
      }
      if (this.character === 1) {
        return chara1;
      }
      if (this.character === 2) {
        return chara2;
      }
      return chara3;
    },
  },
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
