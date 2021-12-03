<template>
  <button :disabled="disabled" :class="disabled && 'disabled'">
    <span class="text" :class="secondary && 'whiteText'">{{ buttonText }}</span
    ><span class="subtext" :class="secondary && 'whiteText'">{{
      buttonsubText
    }}</span>
  </button>
</template>

<script>
export default {
  props: {
    secondary: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    buttonText: String,
    buttonsubText: String,
  },
};
</script>

<style scoped lang="scss">
button {
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  align-items: center;
  vertical-align: middle;
  border: 1px solid #edcd90;
  border-radius: 5px;
  background-color:#141414;

  .text {
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 600;
    color: #dabe75;

    &.whiteText {
      font-size: 1rem;
      line-height: 1.5rem;
      font-weight: 400;
      color: white;
    }
  }

  .subtext {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #b4b0a7;

    &.whiteText {
      color: white;
    }
  }
}

.disabled {
  pointer-events: none;
  opacity: 50%;
  border: 1px solid #ffffff50;
}
</style>
