/**
 * @description 随机成功一个英文数字组成的字符串
 */
export const getRandomId = (): string => {
  return Math.random().toString(36).substring(2);
};

/**
 * @description 获取屏幕实际像素比 有部分屏幕是 2K 的实际像素就要 * 2
 * @param px
 */
export const getActualPixel = (px: number) => {
  const devicePixelRatio: number = window.devicePixelRatio || 1;
  return px * devicePixelRatio;
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
    const total: number = resources.length;
    const _resources: ResourcesUrl = [];
    const load = async (src: string, index: number) => {
      try {
        const res = await fetch(src);
        const blob = await res.blob();
        _resources[index] = window.URL.createObjectURL(blob);
        const { length } = _resources;
        if (length === total && [..._resources].every(x => x)) {
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

type ImageResources = HTMLImageElement[];
/**
 * @description 将图片资源转化为 Image 元素
 * @param resources
 * @param callback
 */
export const loadImageResource = async (
  resources: ResourcesUrl,
  callback?: {
    (progress: number): void;
  }
): Promise<ImageResources> => {
  return await new Promise<ImageResources>((resolve, reject) => {
    const total: number = resources.length;
    const _resources: ImageResources = [];
    const load = async (src: string, index: number) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        _resources[index] = img;

        const { length } = _resources;
        if (length === total && [..._resources].every(x => x)) {
          resolve(_resources);
        } else {
          callback && callback(Math.floor((length / total) * 10000) / 100);
        }
      };
      img.onerror = e => {
        console.error(`Resource ${src} failed to load`);
        reject(e);
      };
    };
    resources.forEach(load);
  });
};

/**
 * @description 十六进制数字转化为十进制数字
 * @param hex
 * @returns 十进制 string
 */
const HEX2DEC = (hex: string) => {
  return parseInt(hex, 16).toString();
};

/**
 * @description 十六进制颜色转化为RGB颜色
 * @param hex
 * @param opacity
 * @returns RGB string
 */
export const transparentHex = (hex: string, opacity: number): string => {
  hex = hex.substring(1);
  if (hex.length === 3) {
    hex += hex;
  }
  return `rgb(${HEX2DEC(hex.substring(0, 2))},${HEX2DEC(
    hex.substring(2, 4)
  )},${HEX2DEC(hex.substring(4))}, ${opacity})`;
};
