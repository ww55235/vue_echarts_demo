import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
//引入echarts
import * as echarts from "echarts";

// console.log(process.env,'process');
// console.log(process.env.VUE_APP_URL)

import "@/assets/font/iconfont.css";

//引入echarts皮肤

import "../public/static/theme/chalk";

//引入全局样式文件
import "./assets/css/global.less";

//echarts 挂载到Vue的原型对象上
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
