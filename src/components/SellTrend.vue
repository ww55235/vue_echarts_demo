<template>
  <!--销量趋势组件-->
  <div class="seller-trend">
    <div class="select-wrapper">
      <label>
        <select class="select" v-model="selectVal" @change="selectHandle">
          <option
            v-for="select of selectTypes"
            :key="select.key"
            :value="select.key"
            >{{ select.text }}</option
          >
        </select>
      </label>
    </div>
    <div class="seller-trend-wrapper"></div>
  </div>
</template>

<script>
import { reqGetTrend } from "../api/getData";
export default {
  name: "SellTrend",
  data() {
    return {
      seller_trend_wrapper: null,
      sellerTrendData: {},
      //下拉框选择项
      selectVal: "map"
    };
  },
  computed: {
    selectTypes() {
      if (this.sellerTrendData.type) {
        return this.sellerTrendData.type;
      }
    }
  },
  mounted() {
    //初始化echarts
    this.initEcharts();
    //适配echarts
    this.screenAdapter();
    this._reqGetTrend();
    window.addEventListener("resize", this.screenAdapter);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    //下拉框选择事件
    selectHandle() {
      // console.log(this.selectVal, "vvv");
      //重新设置option
      this.dataOption();
    },
    //获取数据
    async _reqGetTrend() {
      try {
        this.sellerTrendData = await reqGetTrend();
        this.dataOption();
      } catch (error) {}
    },
    //设置option
    dataOption() {
      // 半透明的颜色值
      const colorArr1 = [
        "rgba(11, 168, 44, 0.5)",
        "rgba(44, 110, 255, 0.5)",
        "rgba(22, 242, 217, 0.5)",
        "rgba(254, 33, 30, 0.5)",
        "rgba(250, 105, 0, 0.5)"
      ];
      // 全透明的颜色值
      const colorArr2 = [
        "rgba(11, 168, 44, 0)",
        "rgba(44, 110, 255, 0)",
        "rgba(22, 242, 217, 0)",
        "rgba(254, 33, 30, 0)",
        "rgba(250, 105, 0, 0)"
      ];

      //legend 数据
      const legendData = [];
      //xAxisData数据
      const xAxisData = this.sellerTrendData.common.month;
      //series 所需要的数据
      const seriesData = this.sellerTrendData[this.selectVal].data.map(
        (item, index) => {
          legendData.push(item.name);
          return {
            type: "line",
            name: item.name,
            data: item.data,
            stack: "map",
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colorArr1[index] },
                {
                  offset: 1,
                  color: colorArr2[index]
                }
              ])
            }
          };
        }
      );
      // console.log(seriesData, "seriesData");
      // console.log(legendData, "legendData");
      const dataOption = {
        legend: {
          data: legendData
        },
        xAxis: {
          data: xAxisData
        },
        series: seriesData
      };
      this.seller_trend_wrapper.setOption(dataOption);
    },

    //init echarts
    initEcharts() {
      this.seller_trend_wrapper = this.$echarts.init(
        document.querySelector(".seller-trend-wrapper"),
        "chalk"
      );
      const initOption = {
        tooltip: {
          trigger: "axis"
        },
        grid: {
          top: "20%"
        },
        legend: {
          top: 20,
          left: 20,
          icon: "circle"
        },
        xAxis: {
          type: "category",
          //线贴边显示
          boundaryGap: false
        },
        yAxis: {
          type: "value"
        }
      };
      this.seller_trend_wrapper.setOption(initOption);
    },
    //屏幕适配
    screenAdapter() {
      const commonSize =
        (document.querySelector(".seller-trend-wrapper").offsetWidth / 100) *
        3.6;
      const adapterOption = {
        legend: {
          itemWidth: commonSize,
          itemHeight: commonSize,
          itemGap: commonSize / 2,
          textStyle: {
            fontSize: commonSize / 2
          }
        }
      };
      // console.log(commonSize);
      this.seller_trend_wrapper.setOption(adapterOption);
      this.seller_trend_wrapper.resize();
    }
  }
};
</script>

<style lang="less" scoped>
.seller-trend {
  width: 100%;
  height: 100%;

  .seller-trend-wrapper {
    width: 100%;
    height: 100%;
  }

  .select-wrapper {
    width: 120px;
    position: absolute;
    top: 30px;
    right: 20px;
    z-index: 5;

    .select {
      width: 100%;
    }
  }
}
</style>
