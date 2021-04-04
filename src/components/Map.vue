<template>
  <div class="Map" @dblclick="backChinaMap">
    <div class="map-wrapper" ref="map_wrapper"></div>
  </div>
</template>
<script>
import getProvinceMapInfo, { name2pinyin } from "@/utils/map_utils";
import { getScatter } from "../api/getData";
import axios from "axios";
export default {
  name: "Map",
  data() {
    return {
      //地图容器
      map_wrapper: null,
      //地图数据
      mapData: {},
      //散点图数据
      scatterData: {},
      //缓存地图数据
      cacahMap: {}
    };
  },
  mounted() {
    //获取地图数据
    this.getMapData();
    this.initEcharts();
    this._getScatter();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    backChinaMap() {
      this.map_wrapper.setOption({
        geo: {
          map: "chinaMap"
        }
      });
    },
    initEcharts() {
      this.map_wrapper = this.$echarts.init(this.$refs.map_wrapper, "chalk");
      //添加点击事件
      this.map_wrapper.on("click", arg => {
        // console.log(arg, "area");
        if (!name2pinyin.hasOwnProperty(arg.name)) return;
        const previnceInfo = getProvinceMapInfo(arg.name);
        const { key, path } = previnceInfo;
        // console.log(previnceInfo, "previnceInfo");
        if (!this.cacahMap[key]) {
          axios({
            url: path
          }).then(
            ({ data }) => {
              this.cacahMap[key] = data;
              this.$echarts.registerMap(key, data);
              this.map_wrapper.setOption({
                geo: {
                  map: key
                }
              });
            },
            err => {
              console.log(err);
            }
          );
        } else {
          this.map_wrapper.setOption({
            geo: {
              map: key
            }
          });
        }
      });
    },

    //获取地图中散点图的数据
    async _getScatter() {
      const legendData = [];
      try {
        this.scatterData = await getScatter();
        const seriesData = this.scatterData.map(item => {
          legendData.push(item.name);
          return {
            type: "effectScatter",
            rippleEffect: {
              brushType: "stroke"
            },
            data: item.children,
            name: item.name,
            coordinateSystem: "geo"
          };
        });
        const option = {
          legend: {
            data: legendData
          },
          series: seriesData
        };

        this.map_wrapper.setOption(option);
      } catch (error) {}
    },

    async getMapData() {
      try {
        const result = await axios({
          url: "/static/map/china.json"
        });
        if (result.status === 200) {
          const { data } = result;
          //注册地图
          this.$echarts.registerMap("chinaMap", data);
          //配置
          this.map_wrapper.setOption({
            title: {
              text: "▎ 商家分布",
              left: 20,
              top: 20
            },
            geo: {
              type: "map",
              map: "chinaMap",
              top: "5%",
              bottom: "5%",
              itemStyle: {
                areaColor: "#2E72BF",
                borderColor: "#333"
              }
            },
            legend: {
              left: "5%",
              bottom: "5%",
              orient: "vertical"
            }
          });
          this.mapData = data;
        }
      } catch (error) {}
    },

    //屏幕适配
    screenAdapter() {
      const commonSize = (this.$refs.map_wrapper.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: commonSize / 2
          }
        },
        legend: {
          itemWidth: commonSize / 2,
          itemHeight: commonSize / 2,
          itemGap: commonSize / 2,
          textStyle: {
            fontSize: commonSize / 2.5
          }
        }
      };
      this.map_wrapper.setOption(adapterOption);
      this.map_wrapper.resize();
    }
  }
};
</script>

<style lang="less" scoped>
.Map {
  width: 100%;
  height: 100%;
  .map-wrapper {
    width: 100%;
    height: 100%;
  }
}
</style>
