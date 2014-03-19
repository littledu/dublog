<{
"title": "github的使用",
"postedOn": "2014-03-17 19:46:16",
"excerpt": "github 是一个共享虚拟主机服务，用于存放使用 Git 版本控制的软件代码和内容项目。它由GitHub公司（曾称Logical Awesome）的开发者Chris Wanstrath、PJ Hyett和Tom Preston-Werner使用Ruby on Rails编写而成。-- 维基百科" 
}>

> **github** 是一个共享虚拟主机服务，用于存放使用 `Git` 版本控制的软件代码和内容项目。它由GitHub公司（曾称Logical Awesome）的开发者Chris Wanstrath、PJ Hyett和Tom Preston-Werner使用Ruby on Rails编写而成。-- 维基百科  

下面，记录下 github 的使用方法：

## 注册github账户  

虽然是英文的，但注册实在没什么好说的，为了完整性写下这句话。。。  

## 下载安装git

点击 [这里](http://git-scm.com/downloads) 下载最新版的git，一步步安装后设置注册github时的 `用户名` 和 `邮箱` ，如下：  

    git config --global user.name "Your name here"
    git config --global user.emil "email@example.com"

## 创建 repository  
1. 点击 [New Repository](https://github.com/repositories/new)
2. 填写相关信息  
![图片](/images/github的使用/1.png)  

点击 `Create repository` 就完成了创建，接下来就可以往里面Push内容了。  

## Push内容  

1. 打开 git bash 进入所要提交的目录里(cd dir)  
2. 执行 git init 进行初始化，生成一个隐藏的.git文件夹  
3. 添加要 push 的文件，如 git add README ， git add -all
4. 接着输入 push 的相关说明： git commit -m 'first commit'
5. 连接repo地址： git remote add origin https://github.com/username/Hello-Github.git
6. 最后一步，推送： git push origin master ，如果是分支则修改 `master` 即可

## Github Page  

Github Page 是 github提供的一个服务，可以让我们为项目建立 `静态` 的站点，当然，也就可以架设静态的博客啦。[littledu.net](http://littledu.net/) 正是使用了 Github Page 创建的。在此感谢 Github。下面简单说一下布署的过程。

1. 创建一个 repository ，注意名字要用 username.github.io
2. 克隆到本地： git clone https://github.com/username/username.github.io
3. 进入本地目录： cd username.github.io
4. git add -all
5. git commit -m 'Initial commit'
6. git push

Over，访问 `username.github.io` 就可以看到站点了。

## Github Page 绑定域名

1. 在 `username.github.io` ，也就是项目根目录下创建一个文件，名为 `CNAME` ，里面写上自己的域名，如：littledu.net
2. 在域名运营商的管理域名下修改 `CNAME`，如： www.littledu.net -> littledu.github.io
3. 修改 `A记录` ，如： littledu.net -> 207.97.227.245

至此，最基本的 github 操作就结束了。但github操作并不仅仅只有这些，尚有很多操作待我慢慢挖掘，慢慢增加。

## 参考链接

* [https://help.github.com/](https://help.github.com/)
* [http://pages.github.com/](http://pages.github.com/)
* [Github Page绑定自己域名](http://fancyoung.com/blog/host-to-github/)