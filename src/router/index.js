import Vue from "vue";

import VueRouter from "vue-router";

import Home from "../views/Home";

Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/seller",
    component: () => import("@/components/Seller"),
    name: "Seller"
  },
  {
    path: "/selltrend",
    component: () => import("@/components/SellTrend"),
    name: "SellTrend"
  },
  {
    path: "/map",
    component: () => import("../components/Map"),
    name: "Map"
  },
  {
    path: "/sellerrank",
    component: () => import("@/components/SellerRank"),
    name: "SellerRank"
  },
  {
    path: "/hotsell",
    component: () => import("@/components/HotSell"),
    name: "HotSell"
  }
];

const router = new VueRouter({
  routes
});

export default router;
