var fs = require('fs'),
    ejs = require('ejs'),
    path = require('path'),
    marked = require('marked'),
    ncp = require('ncp').ncp;

var opts = {},
    config = {};

// 开启GFM并支持代码高亮
marked.setOptions({
    gfm: true,
    langPrefix: 'prettyprint linenums lang-'
});

/**
 * 获取所有的md文件
 * @param  {String} dir md文件存放目录
 */
var getAllMdFiles = function(dir){
    var result = [], files = fs.readdirSync(dir);

    files.forEach(function(file) {
        var pathname = dir+ "/" + file, 
            stat = fs.lstatSync(pathname);

        if(stat === undefined) process.exit(1);

        var mdExts = ['.md', '.markdown'];
        if(!stat.isDirectory() && mdExts.indexOf(path.extname(pathname).toLowerCase()) != -1){
            result.push(pathname);
        }else{
            result = result.concat(getAllMdFiles(pathname))
        }
    });

    return result;
}

/**
 * 获取模板文件
 * @param  {String} root dublog根目录
 * @param  {String} tpl 模板名称
 */
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

/**
 * 编译配置信息
 * @param  {String} root dublog根目录
 */
var parseBlogInfo = function(root){
    var configPath = root + '/config.json';
    if(!fs.existsSync(configPath)){
        console.log(configPath + ' 不存在!');
        process.exit(1);
    }

    config = require(configPath);

    //挂到opts对象
    opts['blog'] = config;

    //创建输出目录
    if(!fs.existsSync(config.distPath)){
        fs.mkdirSync(config.distPath);
    }

    console.log('配置信息编译成功!');
}

/**
 * 编译首页
 */
var compileIndex = function(){
    var index = opts.index,
        articles = opts.articles,
        articleNum = articles.length,
        pageCount = config.pageCount || 9999,
        pageNum, pageCur, prevPage, nextPage,
        html;

    var startIndex = 0,
        endIndex = startIndex + pageCount;

    pageNum = Math.ceil(articleNum / pageCount);
    opts.pageCur = pageCur = 1;
    opts.pageCount = pageCount;
    opts.pageNum = pageNum;

    opts.filename = index.filename;
    opts.index.output = config.distPath + '/index.html';

    while(startIndex <= articleNum-1){
        if(startIndex === 0){
            index.output = config.distPath + '/index.html';
        }else{
            index.output = config.distPath + '/index_' + pageCur + '.html';
        }
        opts.articles = articles.slice(startIndex, endIndex);

        startIndex = endIndex;
        endIndex = startIndex + pageCount;

        html = ejs.render(index.tpl, opts);
        fs.writeFileSync(index.output, html);
        pageCur++;

        opts.pageCur = pageCur;

        console.log(index.output + ' 首页编译成功!');
    }

}

/**
 * 解析首页
 * @param  {String} root dublog根目录
 */
var parseIndex = function(root){
    var tpl = loadTemplate(root, 'index'),
        index = {};

    index.tpl = tpl;
    index.filename = root + '/skin/html/index.ejs';
    //index.output = config.distPath + '/index.html';

    opts['index'] = index;

}

/**
 * 解析md内容
 * @param  {String} content md文件的内容
 */
var parseContent = function(content){
    var start = content.indexOf('<{'),
        end = content.indexOf('}>'),
        o = {};

    var info = content.substring(start+1, end+1),
        content = content.substring(end+2);

    o = JSON.parse(info);
    o.content = content;

    return o;
}

/**
 * 解析文章页和单页
 * @param  {String} root dublog根目录
 * @param  {String} type 类型，区分文章页还是单页
 */
var parseAP = function(root, type){
    var tpl = loadTemplate(root, type),
        APath = root + '/' + type,
        files = getAllMdFiles(APath),
        AP = [];

    files.forEach(function(file){
        var stat = fs.lstatSync(file),
            content = fs.readFileSync(file, 'utf-8'),
            ap = parseContent(content);

        ap.id = ap.id || ap.title;
        ap.id = encodeURIComponent(ap.id); //让链接在浏览器显示好看一点
        ap.filename = root + '/skin/html/'+ type +'.ejs';
        ap.output = config.distPath + '/' + type;
        ap.tpl = tpl;
        ap.link = '/'+ type +'/' + ap.id + '.html';
 
        AP.push(ap);
        
    });

    //按时间顺序排序
    AP.sort(function(v1, v2){
        return new Date(v2['postedOn']) - new Date(v1['postedOn']);
    });

    //挂到opts对象
    opts[type] = AP;

}

/**
 * 编译文章页
 */
var compileArticles = function(){
    var articles = opts.articles,
        output = articles[0].output;

    //创建输出目录
    if(!fs.existsSync(output)){
        fs.mkdirSync(output);
    }

    opts.filename = articles[0].filename;

    articles.forEach(function(article){
        article.content = marked(article.content);
        article.content = article.content.replace(/<pre><code/g, '<pre').replace(/<\/code><\/pre>/g, '</pre>');

        opts['article'] = article;

        var html = ejs.render(article.tpl, opts),
            path = article.output + '/' + decodeURIComponent(article.id) + '.html';

        fs.writeFileSync(path, html);

        console.log(article.title + ' 编译成功!');
        
    });

}

/**
 * 编译单页
 */
var compilePages = function(){
    var pages = opts.pages,
        output = pages[0].output;

    //创建输出目录
    if(!fs.existsSync(output)){
        fs.mkdirSync(output);
    }

    opts.filename = pages[0].filename;

    pages.forEach(function(page){
        page.content = marked(page.content);

        opts['page'] = page;

        var html = ejs.render(page.tpl, opts),
            path = page.output + '/' + page.title + '.html';

        fs.writeFileSync(path, html);

        console.log(page.title + ' 编译成功!');
        
    });

}


var copy = function(src, dest){
    ncp(src, dest, function(err){
        if(err){
           console.log(src + ' 编译失败!');
           console.log(err);
           process.exit(1); 
        }
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

    parseBlogInfo(root);
    parseIndex(root);
    parseAP(root, 'articles');
    parseAP(root, 'pages');
    compileArticles();
    compileIndex();
    compilePages();
    copyStatic(root);
}