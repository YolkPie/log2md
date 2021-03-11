# 从git元数据生成变更日志

## 快速开始

- 安装依赖
``` js
cd [my project]
npm install log2md -D
```

- 配置命令
``` js
// package.json

"log2md": "log2md dev",
```

- 参数配置

命令行参数：
1. --after  开始时间
2. --before 结束时间
3. --week 周 支持 0 -> 上周 1 -> 本周 默认值为1
4. --author 作者
5. --sort 是否排序 支持 0 -> 不排序 1 -> 排序 默认值为1

**示例**
``` js
// package.json

"log2md": "log2md dev --week 1 --sort 1",
```