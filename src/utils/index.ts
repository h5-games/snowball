/// <reference path="../index.d.ts"/>

interface computedPixeInterface {
  (pixe: number): number
}

/**
 * @descriptions 根据当前屏幕计算像素比计算像素（苹果手机高2/3倍像素）
 * @param pixe {number} 基础像素
 * @returns {number} 计算后的像素
 */
export const computedPixe: computedPixeInterface = function(pixe) {
  return pixe * (window.devicePixelRatio || 1)
}

interface sortTerrInterface {
  (
  terrList: {
    [key: string]: TerrInterface
  },
  callback: any
  ): void
}

/**
 * @description 根据树距离屏幕顶部的位置来排序并作操作每个树（上面的树先绘制才能上下面的遮住上面的）
 * @param terrList {object} 树的对象列队
 * @param callback {function} 排序完成后每个树的回调
 */
export const sortTerr: sortTerrInterface = function (terrList, callback) {
  (<any>Object)
    .values(terrList)
    .sort((x, y) => (x.top + x.height) - (y.top + y.height))
    .forEach(terr => callback(terr));
}
