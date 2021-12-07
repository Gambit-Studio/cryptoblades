<template>
  <div class="pvpCharacterWrapper">
    <img :src="getCharacterImageUrl" alt="character" class="characterImg" />
    <img src="../../../../assets/standImage.png" alt="stand" class="characterStand" />
  </div>
</template>

<script>
// import character0 from "../../assets/chara-0.png";
// import character1 from "../../assets/chara-1.png";
// import character3 from "../../assets/chara-3.png";
// import character4 from "../../assets/chara-4.png";

export default {
  props: {
    character: {
      type: String,
      // values: ["character0", "character1", "character2", "character4"],
      required: true,
    },
  },
  // computed: {
  //   getCharacterImageUrl: function () {
  //     if (this.character === "character0") {
  //       return character0;
  //     }
  //     if (this.character === "character1") {
  //       return character1;
  //     }
  //     if (this.character === "character3") {
  //       return character3;
  //     }
  //     return character4;
  //   },
  // },
};
</script>

<style scoped lang="scss">
.pvpCharacterWrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: inherit;
  border: 1px solid green;
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
  bottom: -7%;
  display: flex;
  width: 100%;
}
</style>
