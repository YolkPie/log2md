// help及方法支持

const commander = require('commander');


commander
    .version('1.0.18')
    .description('A cli get log to write md')
    .option('--after <after>', '开始时间')
    .option('--before <before>', '结束时间')
    .option('--author <author>', '作者')
    .option('--week <week>', '周 支持 0 -> 上周 1 -> 本周')
    .option('--all <all>', '展示全部 支持 1 -> 展示全部')
    .option('--sort <sort>', '是否排序 支持 0 -> 不排序 1 -> 排序')
commander
    .command('run')
    .description('run remote setup commands')
    .option('--after <after>', '开始时间')
    .option('--author <author>', '作者')
    .option('--before <before>', '结束时间')
    .option('--all <all>', '展示全部')
    .option('--week <week>', '周 支持 0 -> 上周 1 -> 本周', 1)
    .option('--sort <sort>', '是否排序 支持 0 -> 不排序 1 -> 排序', 1)
    .action((cmd) => {
        
    });
commander.parse(process.argv);