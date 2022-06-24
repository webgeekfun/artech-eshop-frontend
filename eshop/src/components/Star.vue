<template>
  <div class="rating-list">
    <!-- <div>
      <span
      v-for="it in 5"
      :key="it"
      :data-it="it"
      :class="[
        'star-box',
        it < score ? 'bi-star-fill' : isPoint ?  Math.ceil(score) == it ? 'bi-star-half' : 'bi-star-fill' : 'bi-star'
      ]"
    ></span>
    </div> -->

    <span v-for="_ in scoreCom" class="star-box bi-star-fill"></span>
    
    <span v-if="isPoint" class="star-box bi-star-half"></span>

    <span v-if="isPoint">
      <span v-for="it in 4 - scoreCom" class="star-box bi-star"></span>
    </span>
    <span v-else>
      <span v-for="item in 5 - scoreCom" class="star-box bi-star"></span>
    </span>
    <i>{{ score }}</i>
  </div>
</template>

<script>
  export default {
    name: 'Star',
    props: {
      score: {
        default: 0
      }
    },
    data() {
      return {
        isPoint: true
      };
    },
    computed: {
      scoreCom() {
        // 小数
        if (String(this.score).indexOf('.') != -1) {
          this.isPoint = true
          return Number(String(this.score).split('.')[0])
        }  else {
          this.isPoint = false
          return this.score
        }
      }
    }
  };
</script>
