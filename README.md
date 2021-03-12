# 从git元数据生成变更日志

**功能描述：**

> 以当前所在分支纬度抓取git元数据，输出commit信息文档，支持作者筛选、以周纬度筛选，亦可自行配置开始、结束时间。

> 支持分类排序，前置条件为**符合angular规范的commit message**


**commit message 格式示例**
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
"scripts": {
    "log2md": "log2md run",
}
```

- 参数配置

命令行参数：
1. --after <after>  筛选开始时间，检出此开始时间之后的日志

**示例**
``` js
// package.json

"log2md": "log2md run --after 2020-02-02",
```

2. --before <before> 筛选结束时间，检出此结束时间之前的日志


**示例**
``` js
// package.json

"log2md": "log2md run --before 2020-02-02",
```

3. --week <week> 按周纬度筛选 默认值为1,筛选本周 亦可传0，筛选上一周


**示例**
``` js
// package.json

"log2md": "log2md run --week 0",
```

4. --author <author> 按作者筛选，检出此作者的日志
**示例**
``` js
// package.json

"log2md": "log2md run --author yyy",
```

5. --sort <sort> 是否排序  默认值为1,自动排序 亦可传0，不排序

**示例**
``` js
// package.json

"log2md": "log2md run --sort 0",
```

> 命令执行后，自动生成[.log2mdrc.json] 文件，以及[LOG2MD.md] 文件

**.log2mdrc.json**文件说明

``` json
{
    "bookMark": {
        "fix": "修复BUG",
        "fixbug": "修复BUG",
        "feat": "新功能",
        "chore": "打包构建",
        "chroe": "打包构建",
        "style": "样式构建",
        "docs": "补充文档"
    },
    "sort": true
}
```
- bookMark 字段为 type映射名称

> <type>(<scope>): <subject> 中的type为 feat 映射为 新功能， 可手动修改或添加

- sort 字段为布尔值 控制是否排序

**LOG2MD.md**文件说明

- sort为true输出文档格式
``` 
其他:
feat增加目录

 log:
新功能: 支持参数配置

 index:
补充文档: 文档整理
补充文档: 文档新增
新功能: 完成基础骨架搭建

 all:
补充文档: 文档搭建
```

> 符合commit message格式的提交会按照scope进行分类，同时根据配置对type进行映射
不符合commit message格式的提交汇总到其他


- sort为false的输出文档格式

```
log2md版本迭代
支持参数配置
添加了log2md插件源码
文档整理
增加目录
feat增加目录
文档新增
完成基础骨架搭建
```