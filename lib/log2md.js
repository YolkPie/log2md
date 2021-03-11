const shell = require('shelljs')
const commander = require('commander');
const fs = require('fs')

commander
    .version('1.0.13')
    .description('A cli get log to write md')
    .option('--after <after>', '开始时间')
    .option('--before <before>', '结束时间')
    .option('--author <author>', '作者')
    .option('--week <week>', '周 支持 0 -> 上周 1 -> 本周')
    .option('--sort <sort>', '是否排序 支持 0 -> 不排序 1 -> 排序')
commander
    .command('dev')
    .description('run remote setup commands')
    .option('--after <after>', '开始时间')
    .option('--author <author>', '作者')
    .option('--before <before>', '结束时间')
    .option('--week <week>', '周 支持 0 -> 上周 1 -> 本周', 1)
    .option('--sort <sort>', '是否排序 支持 0 -> 不排序 1 -> 排序', 1)
    .action((cmd) => {
        
    });
commander.parse(process.argv);

class Log2mdPlugin {
    constructor(options, sort) {
        this.options = {}
        if (typeof options !== 'undefined') {
            this.keys = Object.keys(options)
            this.keys.length > 0 && this.mergeOptions(options)
        }
        this.sort = sort * 1 === 1
        this._cmd = this.buildCmd()
        // console.log(this._cmd)
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
        this.keys.forEach(item => {
            if (item === 'week') {
                if (options.week * 1 === 1) {
                    this.options.after = this.getTime(0)
                    this.options.before = this.getTime(-6)
                } else {
                    this.options.after = this.getTime(7)
                    this.options.before = this.getTime(1)
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
        const bookMark = {
            fix: '修复BUG',
            fixbug: '修复BUG',
            feat: '新功能',
            chore: '打包构建',
            chroe: '打包构建',
            style: '样式构建',
            docs: '补充文档',
        }
        const regex = /(.+)\((.+)\):\s?(.+)|(.+)/gm
        arr.forEach(item => {
            const {
                message
            } = item
            message.replace(regex, (match, p1, p2, p3, p4) => {
                if (p2) {
                    if (pages[p2]) {
                        pages[p2].push(`${bookMark[p1]}: ${p3}`)
                    } else {
                        pages[p2] = [`\n ${p2}:`]
                        pages[p2].push(`${bookMark[p1]}: ${p3}`)
                    }
                    // return `${bookMark[p1]}: ${p3}`
                } else {
                    pages.other.push(p4)
                }
                // return `其他: ${p4}`
            })
        })
        let result = []
        Object.keys(pages).forEach(key => {
            result = result.concat(pages[key])
        })
        return result.join("\n")
    }

    /**
     * 参数都是以周一为基准的
     * 上周的开始时间		console.log(getTime(7));
     * 上周的结束时间		console.log(getTime(1));
     * 本周的开始时间		console.log(getTime(0));
     * 本周的结束时间		console.log(getTime(-6));
     */
    getTime(n) {
        var now = new Date();
        var year = now.getFullYear();
        //因为月份是从0开始的,所以获取这个月的月份数要加1才行				
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var day = now.getDay();
        //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)		
        if (day !== 0) {
            n = n + (day - 1);
        } else {
            n = n + day;
        }
        if (day) {
            //这个判断是为了解决跨年的问题				
            if (month > 1) {
                month = month;
            }
            //这个判断是为了解决跨年的问题,月份是从0开始的			
            else {
                year = year - 1;
                month = 12;
            }
        }
        now.setDate(now.getDate() - n);
        year = now.getFullYear();
        month = now.getMonth() + 1;
        date = now.getDate();
        const s = year + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date);
        return s;
    }
}


var argv = require('minimist')(process.argv.slice(2));
console.dir(argv, '===argv=====');
let {
    after,
    author,
    before,
    week,
    sort
} = argv


const log2md = new Log2mdPlugin({
    after,
    author,
    before,
    week
}, sort)

log2md.write()