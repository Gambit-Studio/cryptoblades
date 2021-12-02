<template>
  <div>
    <pvp-nav-bar @changeTab="onChangeTab"/>
    <div v-if="tab === 0">TAB ZERO <pvp-weapon :stars="1" element="fire"/></div>
    <div v-if="tab === 1">TAB ONE</div>
  </div>
</template>

<script>
import PvPNavBar from './components/PvPNavBar.vue';

export default {
  components: {
    'pvp-nav-bar': PvPNavBar
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