<template>
  <div class="Stack">
    <div class="stack-wrapper"></div>
  </div>
</template>

<script>
import { getStock } from "../api/getData";
export default {
  name: "Stock",
  data() {
    return {
      allData: [],
      stack_wrapper: null,
      currentPage: 1,
      start: 0,
      end: 5,
      totalPage: 0,
      pageSize: 5
    };
  },
  mounted() {
    this.initEcharts();
    this._getStock();
    // this.screenAdapter();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.screenAdapter);
    //清除定时器
    clearInterval(this.timerId);
  },
  methods: {
    initEcharts() {
      this.stack_wrapper = this.$echarts.init(
        document.querySelector(".stack-wrapper"),
        "chalk"
      );
      const initOption = {
        title: {
          text: "▎热销商品的占比"
        }
      };
      this.stack_wrapper.setOption(initOption);
      this.stack_wrapper.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.stack_wrapper.on("mouseout", () => {
        this.startInterval();
      });
    },
    screenAdapter() {
      clearInterval(this.timerId);
      const commonSize =
        (document.querySelector(".stack-wrapper").offsetWidth / 100) * 3.6;
      const innerRadius = commonSize * 2;
      const outerRadius = innerRadius * 1.125;
      const seriesArr = [];
      for (let i = 0; i < this.pageSize; i++) {
        const obj = {
          type: "pie",
          radius: [outerRadius, innerRadius],
          label: {
            fontSize: commonSize / 2
          }
        };
        seriesArr.push(obj);
      }
      console.log(seriesArr, "radius");
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: commonSize / 2
          }
        },
        series: seriesArr
      };
      this.stack_wrapper.setOption(adapterOption);
      this.stack_wrapper.resize();
      this.startInterval();
    },
    updateOption() {
      this.start = (this.currentPage - 1) * this.pageSize;
      this.end = this.currentPage * this.pageSize;
      const centerArr = [
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["34%", "75%"],
        ["66%", "75%"]
      ];
      const colorArr = [
        ["#4FF778", "#0BA82C"],
        ["#E5DD45", "#E8B11C"],
        ["#E8821C", "#E55445"],
        ["#5052EE", "#AB6EE5"],
        ["#23E5E5", "#2E72BF"]
      ];
      const seriesArr = this.allData
        .slice(this.start, this.end)
        .map((item, index) => {
          return {
            center: centerArr[index],
            hoverAnimation: false,
            labelLine: {
              show: false
            },
            label: {
              show: true,
              position: "center",
              color: colorArr[index][0]
            },
            data: [
              {
                name: item.name + "\n" + item.sales,
                value: item.sales,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: colorArr[index][0]
                    },
                    { offset: 1, color: colorArr[index][1] }
                  ])
                }
              },
              {
                value: item.stock,
                itemStyle: {
                  color: "#333843"
                }
              }
            ]
          };
        });
      const dataOption = {
        series: seriesArr
      };
      this.stack_wrapper.setOption(dataOption);
    },
    async _getStock() {
      try {
        this.allData = await getStock();
        this.totalPage =
          this.allData.length % 5 === 0
            ? this.allData.length / 5
            : Math.ceil(this.allData.length / 5);
        // this.updateOption();
        this.startInterval();
      } catch (err) {}
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updateOption();
        this.currentPage++;
      }, 2000);
    }
  }
};
</script>

<style lang="less" scoped>
.Stack {
  width: 100%;
  height: 100%;
  .stack-wrapper {
    width: 100%;
    height: 100%;
  }
}
</style>
