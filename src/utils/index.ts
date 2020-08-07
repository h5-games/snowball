/**
 * @description 随机成功一个英文数字组成的字符串
 */
export const getRandomId = (): string => {
  return Math.random().toString(36).slice(2);
};
