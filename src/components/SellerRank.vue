<template>
  <div class="SellRank">
    <div class="sell_rank_wrapper" ref="sell_rank_wrapper"></div>
  </div>
</template>

<script>
import { getSellerRank } from "../api/getData";

export default {
  name: "SellerRank",
  data() {
    return {
      sell_rank_wrapper: null,
      rankList: [],
      timer: null,
      //dataZoom 起始值和结束值
      startVal: 0,
      endVal: 9
    };
  },
  mounted() {
    this.initCharts();
    this._getSellerRank();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.timer);
  },
  methods: {
    //屏幕自适应
    screenAdapter() {
      const commonSize = (this.$refs.sell_rank_wrapper.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: commonSize / 2
          }
        },
        series: [
          {
            barWidth: commonSize,
            itemStyle: {
              borderRadius: [commonSize / 2, commonSize / 2, 0, 0]
            }
          }
        ]
      };
      this.sell_rank_wrapper.setOption(adapterOption);
      this.sell_rank_wrapper.resize();
    },
    //初始化图表
    initCharts() {
      this.sell_rank_wrapper = this.$echarts.init(
        this.$refs.sell_rank_wrapper,
        "chalk"
      );
      const initOption = {
        tooltip: {
          show: true
        },

        title: {
          text: "▎ 地区销量排行",
          left: 20,
          top: 20
        },
        grid: {
          left: "5%",
          bottom: "10%",
          top: "15%",
          right: "5%",
          containLabel: true
        },
        xAxis: {
          type: "category"
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            type: "bar"
          }
        ]
      };
      this.sell_rank_wrapper.setOption(initOption);
      //添加移入移出事件
      this.sell_rank_wrapper.on("mouseover", () => {
        clearInterval(this.timer);
      });
      //
      this.sell_rank_wrapper.on("mouseout", () => {
        this.startInterVal();
      });
    },
    //  获取地区销售排行数据
    async _getSellerRank() {
      try {
        this.rankList = await getSellerRank();
        // this.updateChart();
        this.startInterVal();
      } catch (error) {}
    },
    // 更新echarts
    updateChart() {
      const colorArr = [
        ["#0BA82C", "#4FF778"],
        ["#2E72BF", "#23E5E5"],
        ["#5052EE", "#AB6EE5"]
      ];
      let targetColor = [];
      const xAxisData = [],
        seriesData = [];
      this.rankList
        .sort((a, b) => b.value - a.value)
        .forEach(item => {
          seriesData.push(item.value);
          xAxisData.push(item.name);
        });
      const dataOption = {
        dataZoom: {
          show: false,
          startValue: this.startVal,
          endValue: this.endVal
        },
        xAxis: {
          data: xAxisData
        },
        series: [
          {
            data: seriesData,
            itemStyle: {
              color: arg => {
                if (arg.value > 300) {
                  targetColor = colorArr[0];
                } else if (arg.value > 200) {
                  targetColor = colorArr[1];
                } else {
                  targetColor = colorArr[2];
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColor[0]
                  },
                  {
                    offset: 1,
                    color: targetColor[1]
                  }
                ]);
              }
            }
          }
        ]
      };
      this.sell_rank_wrapper.setOption(dataOption);
    },
    // startInterval
    startInterVal() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        if (this.endVal > this.rankList.length - 1) {
          this.startVal = 0;
          this.endVal = 9;
        }
        this.updateChart();
        this.startVal++;
        this.endVal++;
      }, 1000);
    }
  }
};
</script>

<style lang="less" scoped>
.SellRank {
  width: 100%;
  height: 100%;
  .sell_rank_wrapper {
    width: 100%;
    height: 100%;
  }
}
</style>
