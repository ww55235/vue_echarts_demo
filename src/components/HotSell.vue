<template>
  <div class="HotSell">
    <span
      class="iconfont iconpreviewleft arrowLeft"
      :style="getCommonSize"
      @click="arrowHandle(0)"
    ></span>
    <div class="hot_sell_wrapper" ref="hot_sell_wrapper"></div>
    <span
      class="iconfont iconarrow arrowRight"
      :style="getCommonSize"
      @click="arrowHandle(1)"
    ></span>
    <span class="title" :style="getCommonSize">{{ currentTitle }}</span>
  </div>
</template>

<script>
import { getHotSell } from "../api/getData";

export default {
  name: "HotSell",
  data() {
    return {
      hotSellWrapper: null,
      hotEchartsData: [],
      currentIndex: 0,
      commonSize: 0
    };
  },
  computed: {
    currentTitle() {
      if (!this.hotEchartsData.length) return "";
      return this.hotEchartsData[this.currentIndex].name;
    },
    getCommonSize() {
      return {
        fontSize: this.commonSize / 1.5 + "px"
      };
    }
  },
  mounted() {
    this.initEcharts();
    this._getHotSell();
    window.addEventListener("resize", this.adapterHandle);
    this.adapterHandle();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.adapterHandle);
  },
  methods: {
    //箭头点击事件
    arrowHandle(type) {
      // 0 表示 左箭头点击事件 1 表示右箭头点击事件
      if (type === 0) {
        this.currentIndex--;
        if (this.currentIndex < 0) {
          //回到最后一页
          this.currentIndex = this.hotEchartsData.length - 1;
        }
      } else {
        this.currentIndex++;
        //回到第一页
        if (this.currentIndex > this.hotEchartsData.length - 1) {
          this.currentIndex = 0;
        }
      }
      this.updateOption();
    },

    adapterHandle() {
      this.commonSize = (this.$refs.hot_sell_wrapper.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.commonSize / 2
          }
        },
        legend: {
          itemWidth: this.commonSize / 3,
          itemHeight: this.commonSize / 3,
          textStyle: {
            fontSize: this.commonSize / 3
          }
        },
        series: [
          {
            radius: this.commonSize * 4,
            center: ["50%", "50%"]
          }
        ]
      };
      this.hotSellWrapper.setOption(adapterOption);
      this.hotSellWrapper.resize();
    },
    initEcharts() {
      this.hotSellWrapper = this.$echarts.init(
        this.$refs.hot_sell_wrapper,
        "chalk"
      );
      const initOption = {
        title: {
          text: "▎热销商品的占比",
          left: 20,
          top: 20
        },
        tooltip: {
          formatter: arg => {
            const total = arg.data.children.reduce(
              (prev, item) => prev + item.value,
              0
            );
            return arg.data.children
              .map(item => {
                return `${item.name} ${parseInt(
                  (item.value / total) * 100
                )}% <br>`;
              })
              .join("");
          }
        },
        legend: {
          top: "10%",
          icon: "circle"
        },
        series: [
          {
            type: "pie",
            label: {
              show: false
            },
            top: "10%",
            left: "10%",
            right: "10%",
            bottom: "10%",
            emphasis: {
              label: {
                show: true,
                color: arg => {}
              },
              labelLine: {
                show: false
              }
            }
          }
        ]
      };
      this.hotSellWrapper.setOption(initOption);
    },
    async _getHotSell() {
      try {
        this.hotEchartsData = await getHotSell();
        this.updateOption();
      } catch (error) {}
    },
    updateOption() {
      const legendData = [];
      const seriesData = this.hotEchartsData[this.currentIndex].children.map(
        item => {
          legendData.push(item.name);
          return {
            name: item.name,
            value: item.value,
            children: item.children
          };
        }
      );
      const dataOption = {
        legend: {
          data: legendData
        },
        series: [
          {
            data: seriesData
          }
        ]
      };
      this.hotSellWrapper.setOption(dataOption);
    }
  }
};
</script>

<style lang="less" scoped>
.HotSell {
  position: relative;
  width: 100%;
  height: 100%;
  .hot_sell_wrapper {
    width: 100%;
    height: 100%;
  }

  .arrowLeft {
    position: absolute;
    left: 10%;
    top: 50%;
    transform: translateY(-50%);
    font-size: 25px;
    color: white;
    z-index: 5;
    cursor: pointer;
  }
  .arrowRight {
    position: absolute;
    right: 10%;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    color: white;
    cursor: pointer;
  }

  .title {
    position: absolute;
    right: 40px;
    bottom: 20px;
    font-size: 20px;
    color: white;
  }
}
</style>
