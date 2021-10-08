<template>
  <svg
    class="grid"
    height="100%"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="smallGrid"
        height="7.236328125"
        patternUnits="userSpaceOnUse"
        width="7.236328125"
      >
        <path
          d="M 7.236328125 0 L 0 0 0 7.236328125"
          fill="none"
          stroke="rgba(207, 207, 207, 0.3)"
          stroke-width="1"
        />
      </pattern>
      <pattern
        id="grid"
        height="36.181640625"
        patternUnits="userSpaceOnUse"
        width="36.181640625"
      >
        <rect
          fill="url(#smallGrid)"
          height="36.181640625"
          width="36.181640625"
        />
        <path
          d="M 36.181640625 0 L 0 0 0 36.181640625"
          fill="none"
          stroke="rgba(186, 186, 186, 0.5)"
          stroke-width="1"
        />
      </pattern>
    </defs>
    <rect fill="url(#grid)" height="100%" width="100%" />
  </svg>
</template>

<style lang="scss" scoped>
  .grid {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
