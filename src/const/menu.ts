export enum MenuEnum {
  goodsManage = 1,
  shelfRequest,
  userManage,
  statistics,
  category,
  logManage,
}

export const MenuPath = {
  [MenuEnum.goodsManage]: '/goods-manage',
  [MenuEnum.shelfRequest]: '/shelf-request',
  [MenuEnum.userManage]: '/user-manage',
  [MenuEnum.statistics]: '/statistics',
  [MenuEnum.category]: '/category',
  [MenuEnum.logManage]: '/log-manage',
};
