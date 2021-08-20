/**
 * @description 随机成功一个英文数字组成的字符串
 */
export const getRandomId = (): string => {
  return Math.random().toString(36).slice(2);
};

/**
 * @description 获取屏幕实际像素比 有部分屏幕是 2K 的实际像素就要 * 2
 * @param px
 */
export const getActualPixel = (px: number) => {
  const devicePixelRatio: number = window.devicePixelRatio || 1;
  return px * devicePixelRatio;
};

/**
 * @description 观察对象某个 key set 变化
 * @param target
 * @param key
 * @param callback
 */
export const observerSet = <T extends object, K extends keyof T>(
  target: T,
  key: K,
  callback: (value: T[K]) => void
) => {
  let value: T[K] = target[key];
  Object.defineProperty(target, key, {
    set(newValue: T[K]) {
      value = newValue;
      callback(value);
    },
    get() {
      return value;
    }
  });
};

/**
 * @description 取消对对象某个 key 的观察
 * @param target
 * @param key
 */
export const clearObserverSet = <T extends object, K extends keyof T>(
  target: T,
  key: K
) => {
  const value = target[key];
  Object.defineProperty(target, key, { value, writable: true });
};

type ResourcesUrl = string[];
/**
 * @description 加载资源
 * @param resources
 * @param callback
 */
export const loadResource = async (
  resources: ResourcesUrl,
  callback?: {
    (progress: number): void;
  }
): Promise<ResourcesUrl> => {
  return await new Promise<ResourcesUrl>((resolve, reject) => {
    const total: number = Object.keys(resources).length;
    const _resources: ResourcesUrl = [];
    const load = async (src: string) => {
      try {
        const res = await fetch(src);
        const blob = await res.blob();
        _resources.push(window.URL.createObjectURL(blob));
        const { length } = _resources;
        if (length === total) {
          resolve(_resources);
        } else {
          callback && callback(Math.floor((length / total) * 10000) / 100);
        }
      } catch (e) {
        reject(e);
      }
    };
    resources.forEach(load);
  });
};
