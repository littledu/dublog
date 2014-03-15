var fs = require('fs'),
    ejs = require('ejs'),
    path = require('path'),
    moment = require('moment'),
    marked = require('marked'),
    ncp = require('ncp').ncp;

// 开启GFM并支持代码高亮
marked.setOptions({
    gfm: true,
    langPrefix: 'prettyprint linenums lang-'
});

var opts = {},
    config = {};

var getAllMdFiles = function(root){
    var result = [], files = fs.readdirSync(root);

    files.forEach(function(file) {
        var pathname = root+ "/" + file, 
            stat = fs.lstatSync(pathname);

        if(stat === undefined) process.exit(1);

        // 不是文件夹就是文件
        if(!stat.isDirectory() && path.extname(pathname) === '.md'){
            result.push(pathname);
        }else{
            result = result.concat(getAllMdFiles(pathname))
        }
    });

    return result;
}

var loadTemplate = function(root, tpl){
    var path = root + '/skin/html/' + tpl + '.ejs';
    if(!fs.existsSync(path)){
        console.log(path + ' 不存在!');
        process.exit(1);
    }

    var tplContent = fs.readFileSync(path, 'utf-8');
    console.log(path + ' 模板读取成功!');

    return tplContent;
}

var compileBlogInfo = function(root){
    var configPath = root + '/config.json';
    if(!fs.existsSync(configPath)){
        console.log(configPath + ' 不存在!');
        process.exit(1);
    }

    config = require(configPath);

    //挂到opts对象
    opts['blog'] = config;

    console.log('配置信息编译成功!');
}

/**
 * 生成首页
 * @param  {String} root papery根目录
 * @param  {Object} opts 配置对象
 */
var compileIndex = function(root){
    var tpl = loadTemplate(root, 'index');

    opts.filename = root + '/skin/html/index.ejs';

    var html = ejs.render(tpl, opts);

    var indexPath = config.distPath + '/index.html';
    
    fs.writeFileSync(indexPath, html);

    console.log('首页编译成功!');
}

var compileArticles = function(root){
    var tpl = loadTemplate(root, 'articles'),
        articlesPath = root + '/articles',
        files = getAllMdFiles(articlesPath),
        output = config.distPath + '/articles',
        articles = [];

    //创建输出目录
    if(!fs.existsSync(output)){
        fs.mkdirSync(config.distPath);
        fs.mkdirSync(output);
    }

    opts.filename = root + '/skin/html/articles.ejs';

    files.forEach(function(file){
        var stat = fs.lstatSync(file),
            content = fs.readFileSync(file, 'utf-8'),
            ar = {};
        
        content = marked(content);

        ar.title = path.basename(file, '.md');
        ar.abstract = '测试';
        ar.link = '/articles/' + ar.title + '.html';
        ar.postedOn = moment(stat.mtime).format('YYYY-MM-DD HH:mm:ss');
        ar.content = content;
        
        articles.push(ar);
        opts['article'] = ar;

        var html = ejs.render(tpl, opts),
            arPath = output + '/' + ar.title + '.html';

        fs.writeFileSync(arPath, html);

        console.log(ar.title + ' 编译成功!');
        
    });

    //挂到opts对象
    opts['articles'] = articles;

}

var copy = function(src, dest){
    ncp(src, dest, function(err){
        if(err){
           console.log(src + ' 编译失败!');
           console.log(err);
           process.exit(1); 
        }

        console.log(src + ' 编译成功');
    });
}

var copyStatic = function(root){
    var cssSrc = root + '/skin/css',
        cssDest = config.distPath + '/css';

    var jsSrc = root + '/skin/js',
        jsDest = config.distPath + '/js';

    var imagesSrc = root + '/images',
        imagesDest = config.distPath + '/images';

    copy(cssSrc, cssDest);
    copy(jsSrc, jsDest);
    copy(imagesSrc, imagesDest);

}

exports.compile = function(root){
    compileBlogInfo(root);
    compileArticles(root);
    compileIndex(root);
    copyStatic(root);
}