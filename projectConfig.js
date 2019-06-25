// Export project setting to orther modules
var gmiProject = module.exports = {}

// Project name used in error log（项目名称）
gmiProject.projectName = '伯乐想象作文后台'
// 接口服务器地址
gmiProject.add_rort = 'http://47.100.33.5:60001/';
// project port used in local development（本地服务器端口）
gmiProject.port = '9092'
// project version used in version control（项目版本）
gmiProject.version = '1.1.1'
// project root used in local server(项目根路径)
gmiProject.root = '/admin/'
// 最紧凑的输出
gmiProject.jsBeautify = true
// 删除所有的注释
gmiProject.jsComments = false
// 在UglifyJs删除没有用到的代码时不输出警告
gmiProject.jsWarnings = false
// 删除所有的 `console` 语句
gmiProject.jsDrop_console = false
// 内嵌定义了但是只用到一次的变量
gmiProject.jsCollapse_vars = false
// 提取出出现多次但是没有定义成变量去引用的静态值
gmiProject.jsReduce_vars = false