export enum MenuEnum {
  goodsManage = 1,
  shelfRequest,
  userManage,
  statistics,
  category,
}

export const MenuPath = {
  [MenuEnum.goodsManage]: '/goods-manage',
  [MenuEnum.shelfRequest]: '/shelf-request',
  [MenuEnum.userManage]: '/user-manage',
  [MenuEnum.statistics]: '/statistics',
  [MenuEnum.category]: '/category',
};
