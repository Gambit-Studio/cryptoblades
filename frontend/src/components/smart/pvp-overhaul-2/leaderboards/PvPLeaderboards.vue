<template>
  <div class="leaderboardsWrapper">
    <div class="filtersWrapper">
      <select name="" id=""></select>
      <select name="" id=""></select>
      <select name="" id=""></select>
    </div>
    <div class="listWrapper">
      <ul class="playerList">
        <li>
          <span>Rank</span>
          <span>Name</span>
          <span>Level</span>
          <span>Element</span>
          <span>Earned SKILLs</span>
        </li>
        <li>
          <span>1</span>
          <span>Player 1</span>
          <span>11</span>
          <span>Fire</span>
          <span>4</span>
        </li>
        <li>
          <span>2</span>
          <span>Player 2</span>
          <span>12</span>
          <span>Earth</span>
          <span>3</span>
        </li>
        <!-- <li :v-for="player in players" :key="player.name">
          <span>{{ player.rank }}</span>
          <span>{{ player.name }}</span>
          <span>{{ player.level }}</span>
          <span>{{ player.element }}</span>
          <span>{{ player.earnedSkill }}</span>
        </li> -->
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      players: [
        {
          name: 'Player1',
          rank: 1,
          level: 55,
          element: 'fire',
          earnedSkill: 21
        },
        {
          name: 'Player2',
          rank: 2,
          level: 48,
          element: 'fire',
          earnedSkill: 20
        },
        {
          name: 'Player3',
          rank: 3,
          level: 13,
          element: 'earth',
          earnedSkill: 19
        }
      ]
    };
  }
};
</script>

<style scoped lang="scss">
.leaderboardsWrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.listWrapper {
  width: 100%;
  margin-top: .5rem;
  .playerList {
    margin: 0;
    padding: 0;
    list-style-type: none;
    justify-content: space-between;
    li {
      display: flex;
      width: 100%;
      span {
        display: flex;
      }
    }
    li:first-of-type {
      color: #CEC198;
      border-bottom: 1px solid #404857;
      padding: 0.5rem 0;
    }
    li:not(first-of-type) {
      color: #B4B0A7;
    }
  }
}
</style>