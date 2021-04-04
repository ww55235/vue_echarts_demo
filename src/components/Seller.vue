<template>
  <div class="seller">
    <div class="seller-wrapper" ref="seller_echarts_wrapper"></div>
  </div>
</template>

<script>
import { reqGetSeller } from '../api/getData'
export default {
  name: 'HelloWorld',
  data() {
    return {
      //商家echarts容器
      sellerWrapper: null,
      //商家数据
      sellerList: [],
      //当前的页数
      currentPage: 1,
      //总页数
      totalPage: 0,
      //  定时器
      timer: null,
    }
  },
  mounted() {
    //获取商家信息
    this._reqGetSeller()
    //  初始化echarts
    this.initEcharts()
    window.addEventListener('resize', this.resizeHandle)
    this.adapterOption()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    window.removeEventListener('resize', this.resizeHandle)
  },
  methods: {
    //屏幕大小变化
    resizeHandle() {
      this.adapterOption()
    },
    //屏幕适配option
    adapterOption() {
      //  console.log(this.$refs.seller_echarts_wrapper.offsetWidth, 'offsetWidth');
      const commonSize =
        (this.$refs.seller_echarts_wrapper.offsetWidth / 100) * 3.6
      // console.log(commonSize, 'commonSize');
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: commonSize / 2,
          },
        },
        series: [
          {
            barWidth: commonSize,
            itemStyle: {
              borderRadius: [0, commonSize / 2, commonSize / 2, 0],
            },
          },
        ],
      }
      this.sellerWrapper.setOption(adapterOption)
      this.sellerWrapper.resize()
    },
    //初始化echarts
    initEcharts() {
      this.sellerWrapper = this.$echarts.init(
        document.querySelector('.seller-wrapper'),
        'chalk'
      )
      //初始化option
      const initOption = {
        title: {
          text: '▎商家销售统计',
          left: 20,
          top: 20,
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 20,
          top: 70,
          //包含label文字
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            z: 0,
          },
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
            },
            itemStyle: {
              // x1 y1 x2 y2 坐标值  0, 0, 1, 0
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                // 0%下的颜色
                {
                  offset: 0,
                  color: '#5052EE',
                },
                //  100%下的颜色
                {
                  offset: 1,
                  color: '#AB6EE5',
                },
              ]),
            },
          },
        ],
      }
      this.sellerWrapper.setOption(initOption)
      //注册鼠标移入和移出事件
      this.sellerWrapper.on('mouseover', () => {
        clearInterval(this.timer)
      })
      this.sellerWrapper.on('mouseout', () => {
        this.startInterval()
      })
    },
    //获取商家信息
    async _reqGetSeller() {
      this.sellerList = await reqGetSeller()
      //对数组进行排序
      this.sellerList.sort((a, b) => a.value - b.value)
      this.totalPage =
        this.sellerList.length % 5 === 0
          ? this.sellerList.length / 5
          : Math.ceil(this.sellerList.length / 5)
      this.updateData()
      this.startInterval()
    },
    //开启定时器
    startInterval() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateData()
      }, 3000)
    },
    updateData() {
      const yAxisData = [],
        seriesData = []
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      this.sellerList.slice(start, end).forEach((item) => {
        yAxisData.push(item.name)
        seriesData.push(item.value)
      })
      const dataOption = {
        yAxis: {
          data: yAxisData,
        },
        series: [
          {
            data: seriesData,
          },
        ],
      }
      this.sellerWrapper.setOption(dataOption)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.seller {
  width: 100%;
  height: 100%;

  .seller-wrapper {
    width: 100%;
    height: 100%;
  }
}
</style>
