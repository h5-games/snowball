## Canvas H5 小游戏，操纵雪球向下滚动，躲避树木
> 练习TypeScript用的

```
# 安装依赖
yarn or npm install

# 启动服务
yarn start

# 编译代码
yarn build
```

### 调整计划
* engine 调整为 Class
* 依据宽度计算 ball 和 terr 的大小
* 初始化 两个参数 container 和 config
* 抽出所有 config 配置文件 保证 engine 干净 在 constructor 中 合并 config
* 封装事件队列
* Canvas 内容层级化 元素化 关联事件队列 （量力而行）
* 给元素加过渡动画（量力而行）
* 游戏增加 X 轴画布变化 规范 ball Y 轴移动速度

