## Canvas H5 小游戏，操纵雪球向下滚动，躲避树木
> 用来练习TypeScript的

```
# 安装依赖
yarn or npm install

# 启动服务
yarn start

# 编译代码
yarn build
```

### 调整计划
* 依据宽度计算 ball 和 terr 的大小
* 初始化 两个参数 container 和 config
* 抽出所有 config 配置文件 保证 engine 干净 在 constructor 中 合并 config
* 给元素加过渡动画
* 游戏增加 X 轴画布变化 规范 ball Y 轴移动速度
* 封装 Unit 类 抽出动画和绘制方法 传入参数 Engine 实例
* Engine 提供校验元素碰撞接口
* 每次动画完毕 传入所有元素进校验 函数
* 创建 Camera 的时候增加目标对象选择，可以跟随目标对象位置
