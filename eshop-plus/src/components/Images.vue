<template>
  <div class="thumb-example">
    <div hidden>{{ cskuPicture }}</div>
    <swiper
      class="swiper swiper1-wrapper"
      :options="swiperOptionTop"
      v-viewer="options"
      ref="swiperTop"
    >
      <swiper-slide v-for="(pic, index) in pics_M" :key="index">
        <img :src="pic" :data-src="pic" :key="index" alt="" />
      </swiper-slide>
    </swiper>
    <!-- 放大镜 -->
    <div class="loupe" @click="showView">
      <span class="bi-zoom-in"></span>
    </div>

    <div class="thumbs2">
      <div class="swiper2-wrapper">
        <div class="swiper-button-prev"></div>

        <div class="swiper swiper-thumbs swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide thumbs" v-for="(pic1, ind) in pics_S" :key="ind">
              <img :src="pic1" alt="" />
            </div>
          </div>
        </div>

        <div class="swiper-button-next"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
  import 'swiper/css/swiper.css';

  export default {
    name: 'Images',
    props: {
      skuPicture: {
        type: String,
        default: ''
      },
      pics_M: {
        type: Array,
        default: () => []
      },
      pics_S: {
        type: Array,
        default: () => []
      }
    },
    components: {
      Swiper,
      SwiperSlide
    },
    mounted() {
      this.slide();
    },
    computed: {
      cskuPicture() {
        this.slide();
        return this.skuPicture;
      }
    },
    data() {
      const _this = this;
      return {
        realIndex: 0, //某张轮播图片
        options: {
          url: 'data-src',
          inline: false,
          navbar: false,
          title: false,
          tooltip: false,
          movable: false,
          rotatable: false,
          scalable: false,
          fullscreen: false,
          keyboard: false
        },
        swiperOptionTop: {
          loop: false,
          direction: 'vertical',
          loopedSlides: 4, // looped slides should be the same
          spaceBetween: 12,
          slidesPerGroup: 1,
          observer: true, //修改swiper自己或子元素时，自动初始化swiper
          observeParents: true, //修改swiper的父元素时，自动初始化swiper
          on: {
            slideChangeTransitionEnd: function() {
              // 获取当前轮播的索引
              _this.realIndex = this.realIndex;
            }
          },
          thumbs: {
            swiper: {
              el: '.swiper-thumbs',
              slidesPerView: 4,
              direction: 'vertical',
              spaceBetween: 12,
              watchSlidesVisibility: true,
              watchSlidesProgress: true,
              observer: true, //修改swiper自己或子元素时，自动初始化swiper
              observeParents: true, //修改swiper的父元素时，自动初始化swiper
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
              }
            },
            autoScrollOffset: 1
          }
        }
      };
    },
    methods: {
      showView() {
        const viewer = this.$el.querySelector('.swiper1-wrapper').$viewer;
        // viewer.show() //直接展示图片
        viewer.view(this.realIndex); //展示某个图片
      },
      slide() {
        const value = this.skuPicture;
        const _this = this;
        this.$nextTick(() => {
          if (value) {
            // 选择后，让对应图片显示滑动到左侧
            _this.pics_M.forEach(element => {
              if (element == value) {
                const thumbsArr = document.getElementsByClassName('thumbs');
                for (const k in thumbsArr) {
                  if (thumbsArr[k].childNodes) {
                    const str = thumbsArr[k].childNodes[0].src;
                    // 字符串截图后20位
                    const s = str.substring(str.length - 20, str.length);
                    if (element.indexOf(s) != -1) {
                      _this.$refs.swiperTop.$swiper.slideTo(k);
                    }
                  }
                }
              }
            });
          }
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .thumb-example {
    width: 100%;
    height: 340px;
    position: relative;

    .swiper-container {
      display: flex;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      overflow: hidden;
      z-index: 1;
    }

    .swiper-slide {
      position: relative;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      width: 100%;
      justify-content: center;

      img {
        max-height: 100%;
        display: inline-block;
        max-width: 100%;
        height: auto;
      }
    }

    // 轮播图
    .swiper1-wrapper {
      height: 100%;
      width: 80%;
      margin-left: 20%;
      border: 1px solid #ddd;
    }

    // 缩略图
    .swiper2-wrapper {
      width: 17%;
      position: absolute;
      top: 0;
    }
    .swiper2-wrapper {
      .swiper-thumbs {
        width: 99%;
        height: 340px;
        box-sizing: border-box;

        .swiper-slide {
          border: 1px solid #ddd;

          &.swiper-slide-thumb-active {
            border: 1px solid $fontActiveColor;
          }
        }
      }

      .swiper-button-prev,
      .swiper-button-next {
        top: auto;
        left: 50%;
        margin-left: -14px;
        color: $fontDefaultColor;
        transform: scale3d(0.5, 0.5, 0.5) rotate(90deg);

        &:hover {
          fill: $fontActiveColor;
          color: $fontActiveColor;
        }
      }

      .swiper-button-prev:after,
      .swiper-button-next:after {
        font-size: 40px;
      }

      .swiper-button-prev {
        top: -15px;
      }
      .swiper-button-next {
        bottom: -37px;
      }
    }
  }

  .swiper-button-next,
  .swiper-container-rtl .swiper-button-prev {
    right: auto;
  }

  .pad {
    .thumb-example,
    .swiper2-wrapper .swiper-thumbs {
      height: 300px;
    }
  }

  .phone {
    .thumb-example,
    .swiper2-wrapper .swiper-thumbs {
      height: 250px;
    }
  }
  // 放大镜
  .loupe {
    position: absolute;
    right: 10px;
    top: 0px;
    z-index: 2;
    cursor: pointer;

    span {
      font-size: 30px;
    }
  }
</style>
