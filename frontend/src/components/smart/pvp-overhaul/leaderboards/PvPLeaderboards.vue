<template>
  <div class="leaderboardsWrapper">
    <div class="filtersWrapper">
        <div class="selectWrapper">
          <label for="tier">Tier: </label>
          <select name="tier" id="tier">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
        </div>
        <div class="selectWrapper">
          <label for="element">Element: </label>
          <select name="element" id="element">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
        </div>
        <div class="selectWrapper">
          <label for="numberOfListings">Listings per page: </label>
          <select name="numberOfListings" id="numberOfListings">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
        </div>
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
  .filtersWrapper {
    display: flex;
    width: 1000px;
    background-color: black;
    flex-direction: row;
    color: #B4B0A7;
    .selectWrapper {
      display: flex;
      position: relative;
      width: 200px;
      align-items: center;
      vertical-align: middle;
      margin-right: 1rem;
      background-color: red;
      opacity: 1;
      label {
        position: absolute;
        z-index: 20;
        margin-left: 0.5rem;
        margin-top: 1.25rem;
        top: 50%;
        background-color: #fff;
        transform: translateY(-50%);
      }
      select {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 30;
        display: flex;
        width: 100%;
        height: 2.5rem;
        border: none;
        border-radius: 0.25rem;
        color:#B4B0A7;
        background: transparent;
      }
    }
    .selectWrapper:first-of-type {
      select {
        padding-left: 2.5rem;
      }
    }
    .selectWrapper:nth-of-type(2) {
      select {
        padding-left: 4rem;
      }
    }
    .selectWrapper:last-of-type {
      select {
        padding-left: 7.25rem;
      }
    }
  }
  .listWrapper {
    width: 100%;
    margin-top: 3rem;
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
}
</style>