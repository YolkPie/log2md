require('./commander');
const tool = require('./tools')
const shell = require('shelljs')
const fs = require('fs')


class Log2mdPlugin {
    constructor(options, sort) {
        this.bookMark = {
            fix: '修复BUG',
            fixbug: '修复BUG',
            feat: '新功能',
            chore: '打包构建',
            chroe: '打包构建',
            style: '样式构建',
            docs: '补充文档',
        }
        this.sort = sort * 1 === 1
        this.defaultConfig = {
            bookMark: this.bookMark,
            sort: this.sort
        }
        this.loadConfig()


        this.options = {}
        if (typeof options !== 'undefined') {
            this.keys = Object.keys(options)
            this.keys.length > 0 && this.mergeOptions(options)
        }
        
        this._cmd = this.buildCmd()
        // console.log(this._cmd)
    }

    mergeConfig(config) {
        const { bookMark, sort } = config
        if(bookMark) {
            this.bookMark = bookMark
        }
        if(sort) {
            this.sort = sort
        }
    }

    loadConfig() {
        try {
            const data = fs.readFileSync('./.log2mdrc.json', 'utf-8')
            if(typeof data !== 'undefined' && JSON.parse(data)) {
                this.mergeConfig(JSON.parse(data))
            }
        } catch (error) {
            fs.writeFile('./.log2mdrc.json', JSON.stringify(this.defaultConfig), err => {
                if (err) {
                    console.error(err)
                    return
                }
                console.error('文件写入成功。')
            })
        }
    }

    get() {
        return new Promise((resolve, reject) => {
            shell.exec(this._cmd, (code, stdout, stderr) => {
                if (code) {
                    reject(this.sort ? this.formateAndSort(stderr) : this.formate(stderr))
                } else {
                    resolve(this.sort ? this.formateAndSort(JSON.parse(stdout)) : this.formate(JSON.parse(stdout)))
                }
            })
        })
    }
    write() {
        this.get().then(res => {
            fs.writeFile('./CHANGELOG.md', res, err => {
                if (err) {
                    console.error(err)
                    return
                }
                console.error('文件写入成功。')
            })
        })
    }

    // tools
    buildCmd() {
        const keys = Object.keys(this.options)
        const result = keys.map(item => {
            return this.options[item] ? `--${item}="${this.options[item]}"` : ''
        }).join(' ')

        return `git log \
    --date=iso ${result} --no-merges --pretty=format:'{"commit": "%h","author": "%aN <%aE>","date": "%ad","message": "%s"},' \
    $@ | \
    perl -pe 'BEGIN{print "["}; END{print "]\n"}' | \
    perl -pe 's/},]/}]/'`
    }
    mergeOptions(options) {
        if(options.all) {
            return
        }
        this.keys.forEach(item => {
            if (item === 'week') {
                if(typeof options.week === 'undefined' || options.week * 1 === 1) {
                    this.options.after = tool.getTime(0)
                    this.options.before = tool.getTime(-6)
                } else {
                    this.options.after = tool.getTime(7)
                    this.options.before = tool.getTime(1)
                }
            } else {
                this.options[item] = options[item]
            }
        })
    }
    formate(arr) {
        const result = arr.map(item => {
            const {
                // commit,
                // title,
                // author,
                // date,
                message
            } = item
            const regex = /.+\(.+\):\s?(.+)|(.+)/gm
            return message.replace(regex, (match, p1, p2) => {
                return p1 || p2
            })
        })
        return result.join("\n")
    }
    formateAndSort(arr) {
        const pages = {
            other: ['其他:']
        }
        const regex = /(.+)\((.+)\):\s?(.+)|(.+)/gm
        arr.forEach(item => {
            const {
                message
            } = item
            message.replace(regex, (match, p1, p2, p3, p4) => {
                if (p2) {
                    if (pages[p2]) {
                        pages[p2].push(`${this.bookMark[p1]}: ${p3}`)
                    } else {
                        pages[p2] = [`\n ${p2}:`]
                        pages[p2].push(`${this.bookMark[p1]}: ${p3}`)
                    }
                } else {
                    pages.other.push(p4)
                }
            })
        })
        let result = []
        Object.keys(pages).forEach(key => {
            result = result.concat(pages[key])
        })
        return result.join("\n")
    }

}


var argv = require('minimist')(process.argv.slice(2));
console.dir(argv, '===argv=====');
let {
    after,
    author,
    before,
    week,
    sort,
    all
} = argv


const log2md = new Log2mdPlugin({
    after,
    author,
    before,
    week,
    all
}, sort)

log2md.write()