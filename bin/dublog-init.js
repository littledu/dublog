#!/usr/bin/env node

var fs = require('fs'),
    ncp = require('ncp').ncp;

//设置source的路径
var source = __dirname + '/../source';
if(!fs.existsSync(source)){
    console.log('source目录不存在,请重新执行 npm install -g dublog');
    process.exit(1);
}

//拷贝source
var src = source,
    dest = process.cwd();

ncp(src, dest, function(err){
    if(err){
       console.log('复制source目录失败!');
       console.log(err);
       process.exit(1); 
    }

    console.log('博客初始化成功');
});