import request from "../utils/request";

//获取商家信息
export const reqGetSeller = () =>
  request({
    url: "seller"
  });

//获取销量趋势数据
export const reqGetTrend = () =>
  request({
    url: "trend"
  });

//获取地图中散点图的数据
export const getScatter = () =>
  request({
    url: "map"
  });

//获取地区销售排行数据

export const getSellerRank = () =>
  request({
    url: "rank"
  });

// 获取热销商品的数据

export const getHotSell = () =>
  request({
    url: "hot"
  });
