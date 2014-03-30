<{
"title": "基于NODE的静态博客",
"postedOn": "2014-03-19 12:57:16",
"excerpt": "dublog 是一个基于NODE的静态博客程序，利用它可以用 markdown 来写文章，满足你geek的变态心理" 
}>

`dublog` 是一个基于NODE的静态博客程序，利用它可以用 `markdown` 来写文章，满足你geek的变态心理。
目前只有最基本的功能，写文章，写单页(page)，什么分页，分类，评论，RSS等通通都没有。因为我觉得这样就够了，所以我想这东西只有我自己用了，但我还是尽可能的把代码，注释都写清晰了，方便有缘的你来修改扩展成你自己要的，同时也方便我自己以后维护。

当然，首先默认你已安装了 [NODE](http://nodejs.org/)

## 安装 
``` bash
npm install -g dublog
```

## 初始化 
在任意盘符下新建你的博客目录，如 `myblog`，用命令行进入此目录 `cd myblog`， 然后执行下面代码进入初始化 

``` bash 
dublog-init
```

初始化后你会看到 `myblog` 目录下多了以下目录： 

* `articles` 存放文章的目录，新增的md文章就扔这里
* `images` 存放图片的目录，文章或单页需要用到的图片就扔这里
* `pages` 存放单页的目录，新增的md单页就扔这里
* `skin` 存放模版和皮肤的目录，如果你想修改模版和皮肤就在这里面找
* `config.json` 博客的配置文件，配置信息极简
 
## 编译 

继续执行下面命令行： 

``` bash 
dublog-build
```

将会在你 `config.json` 指定的输出目录下生成博客

### 启动服务器 

``` bash 
dublog-server
```

打开浏览器输入 `http://localhost:1307` ，当当当，你的博客就出现在你面前了。

最后，你可以把输出的目录放到你的个人空间或github page上，如我放在github page上的 [http://littledu.net/](http://littledu.net/)

## 写文章
刚开始，文章的发表时间我用的是md文件的创建时间，但发现文件一换目录，时间就都变了，最后还是按常规的在文章前面加一些信息，如你生成博客后打开我附带的文章md文件，将都会在前面看到如下信息： 

``` javascript
<{
    "title": "github的使用",
    "postedOn": "2014-03-17 19:46:16",
    "excerpt": "github 是一个共享虚拟主机服务，用于存放使用 Git 版本控制的软件代码和内容项目。它由GitHub公司（曾称    Logical Awesome）的开发者Chris Wanstrath、PJ Hyett和Tom Preston-Werner使用Ruby on Rails编写而成。-- 维基百科" 
}> 
```

相信看名称也知道是作什么用的了，记得写文章或page时都要严格按此格式来添加。

至此，貌似就完了。
最后 

* 感谢把静态博客带到我面前的 [toosolo](https://github.com/TooBug/TooSolo)
* 感谢 [ericzhang-cn](https://github.com/ericzhang-cn) 写了清晰易懂的 [papery](https://github.com/ericzhang-cn/papery)，让我学会了原理