# 从git元数据生成变更日志

**功能描述：**

> 抓取git元数据，输出commit信息文档，支持作者筛选、周纬度筛选，亦可自行配置开始、结束时间。
> 支持分类排序，前置条件为符合angular规范的commit message

``` js
<type>(<scope>): <subject>

feat(login): 登陆状态管理功能实现
```

**推荐commit规范检测工具辅助开发**

[validate-commit-msg](https://www.npmjs.com/package/validate-commit-msg)


## 快速开始

- 安装依赖
``` js
cd [my project]
npm install log2md -D
```

- 配置命令
``` js
// package.json

"log2md": "log2md run",
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

"log2md": "log2md run --week 1 --sort 1",
```

> 命令执行后，自动生成.log2mdrc.json 文件

- bookMark 字段为 type映射名称
- sort 字段为布尔值 控制是否排序


输出文档格式
``` 
其他:
feat添加git分支管理策略

 code:
补充文档: 重构-22种坏味道

 log:
新功能: 支持参数配置

 index:
新功能: 添加了log2md插件源码
补充文档: 文档整理
新功能: 增加目录
补充文档: 文档新增
新功能: 完成基础骨架搭建

 all:
补充文档: 文档搭建
```