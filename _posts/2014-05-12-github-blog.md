---
layout: post
title: 在github上搭建个人博客
category: zongjie
---

#文章内容

###1.注册git账号##

###2.创建一个项目##

###3.密钥设置##

###4.下载我的代码##

###5.安装jekyll##

###6.修改自己的博客##

###7.上传代码，生成自己的博客##

******************************************************************************************************

####1.注册git账号##
打开[github](https://github.com/ "github官网")官网，注册一个账号，将我们自己的代码托管在github上。

注册该站点有两个目的:

+托管我们的开源项目;

+在上面建个静态博客吧。

<!-- more -->

####2.创建一个项目##

注册好我们自己的github账号后，就可以开始创建属于自己的静态博客了，点击右上角的用户名。如图：

![image](/image/create_repo/1.png )

进入下一个页面后，首先点击左边红框中的Repositories选项卡，然后点击右边红框的“New”，如下图：

![image](/image/create_repo/2.png )

进入下一页，填写我们的项目名称,描述信息等。当然，你还可以选择你的项目协议，是否开源之类的，然后点击“Create Repository”,如图：

![image](/image/create_repo/3.png )

接下来点击右边的扳手（setting）图标，出现新页面后点击“Automatic Page Generator”，如图：

![image](/image/create_repo/4.png )

我们看到跳转的页面:

Project Name:网站标题;

Tagline：网站副标题；

Body：这个就是网页源码了；

Google Analytics Tracking ID：搜索引擎抓取关键字.

这些你都可以自定义。

定义好后，点击" Continue to Layouts"。如图：

![image](/image/create_repo/5.png )

选定一个主题，点击“publish”，这样就生成了自己的博客网站。

![image](/image/create_repo/6.png )

不过此时不能直接访问自己的网站，你会看到这个

![image](/image/create_repo/7.png )

我们耐心的等待10分钟，然后便可以愉快的看看我们的个人博客了[wsswdl.github.com/blog](http://wsswdl.github.com/blog "wsswdl的个人博客")。

####3.密钥设置##

为了创建我们自己的博客，需要使用git更新我们的代码，所以打开安装成功的Git Bash（git的安装过程参见[git安装](http://jingyan.baidu.com/article/90895e0fb3495f64ed6b0b50.html) ）。
创建SSH Keys，执行下句命令：

	ssh-keygen -t rsa -C "邮箱"

“邮箱”输入你自己的邮箱比如 "xxxxxxxxx @gmail.com",然后会要你将密钥保存到一个路径，我将其保存到/d/testC#/dll/git/id_rsa(id_rsa为文件名),输入完整，会让你输入一个密码，输入即可。

（PS:不知道什么是SSH Keys，普及一下：SSH keys 即 Secure Shell Keys，是为了防止任何人随意clone 或 push 代码而产生的. keys 有公匙和密匙,你在本地生成了密匙和公匙之后,把你的公匙告诉给服务器或者其他协作者,那么你就可以在他们的git版本库clone和push代码等操作.相对于一台服务器来说,一台协作者机器对应一个SSH keys.SSH有两种，一种基于口令，一种基于密钥。）

![image](/image/create_repo/8.png )

成功生成了我的密钥。

![image](/image/create_repo/9.png )

打开rsa.pub，将里面的东西复制出来，按照下图的步骤将密钥复制到ssh中。

![image](/image/create_repo/10.png )

如果我们收到了邮件的验证通知，说明我们成功了，接下来连接到我们的项目。

接下来连接我的项目。

首先输入下段命令登录

	ssh-agent bash --login -i

然后添加我们的私钥（前面生成的），输入下段命令
	ssh-add d:/testC#/dll/git/web/rsa

我的私钥放在了d:/testC#/dll/git/web/文件下，文件名为rsa

最后运行

	ssh -T git@github.com

提示：

![image](/image/create_repo/11.png )

连接成功！

####4.下载我的代码##

进入自己创建的Repository中，并点击Copy按钮，如下图：

![image](/image/create_repo/12.png )

在git bash中进入想存放代码的路径下，然后执行语句：

	git clone https://github.com/wsswdl/blog.git

clone 后面的地址便是你刚刚copy的地址。

这是你可以在你的当前路径下看到blog文件，里面的如下图：

![image](/image/create_repo/13.png )


####5.安装jekyll##

什么是jekyll，使用jekyll的原因以及安装jekyll的过程参见[天壤的博客](http://blog.segmentfault.com/skyinlayer/1190000000406011) 。

###6.修改自己的博客##

新手自己做网页的前段会比较麻烦，而且效果也许不会很好，这里提供许多[jekyll模板](https://github.com/jekyll/jekyll/wiki/Sites), 选择
一个自己喜欢的博客风格，采用第4步的方法，下载到自己的本地。

将除了.git目录外，其他的所有文件复制到本地的blog文件下，修改里面的_config.yml文件。

###7.上传代码，生成自己的博客##

最后上传我们的代码，生成自己的博客，输入以下命令：

	git add .
	git commit -am "first post"
	git push

然后进入博客[wsswdl.github.com/blog](http://wsswdl.github.com/blog ，大功告成！


>注：本文章参考了[Flyher's NoteBook](http://www.cnblogs.com/flyher/p/3361140.html#tip4) ,[天壤的博客](http://blog.segmentfault.com/skyinlayer/1190000000406011)
等博客，在此说明并加以感谢，如果不清楚的也可以访问这些博客。







这是一个普通段落。

<table>
    <tr>
        <td>Foo</td>
    </tr>
</table>

这是另一个普通段落。

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
> 
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.



> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
id sem consectetuer libero luctus adipiscing.

> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.

> ## 这是一个标题。
> 
> 1.   这是第一行列表项。
> 2.   这是第二行列表项。
> 
> 给出一些例子代码：
> 
>     return shell_exec("echo $input | $markdown_script");

-   Red
-   Green
-   Blue

1.  Bird
2.  McHale
3.  Parish

<ol>
<li>Bird</li>
<li>McHale</li>
<li>Parish</li>
</ol>

*   Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
    Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi,
    viverra nec, fringilla in, laoreet vitae, risus.
*   Donec sit amet nisl. Aliquam semper ipsum sit amet velit.
    Suspendisse id sem consectetuer libero luctus adipiscing.

*   Bird
*   Magic

*   Bird

*   Magic

1.  This is a list item with two paragraphs. Lorem ipsum dolor
    sit amet, consectetuer adipiscing elit. Aliquam hendrerit
    mi posuere lectus.

    Vestibulum enim wisi, viverra nec, fringilla in, laoreet
    vitae, risus. Donec sit amet nisl. Aliquam semper ipsum
    sit amet velit.

2.  Suspendisse id sem consectetuer libero luctus adipiscing.

I get 10 times more traffic from [Google] [1] than from
[Yahoo] [2] or [MSN] [3].

  [1]: http://google.com/        "Google"
  [2]: http://search.yahoo.com/  "Yahoo Search"
  [3]: http://search.msn.com/    "MSN Search"

I get 10 times more traffic from [Google](http://google.com/ "Google")
than from [Yahoo](http://search.yahoo.com/ "Yahoo Search") or
[MSN](http://search.msn.com/ "MSN Search").

*single asterisks*

_single underscores_

**double asterisks**

__double underscores__

Use the printf() function.
Use the `printf()` function.
A single backtick in a code span: `` ` ``

A backtick-delimited string in a code span: `` `foo` ``

Please don't use any `<blink>` tags.

![image](/image/image.png "Optional title")

![image](http://static.open-open.com/news/uploadImg/20140404/20140404213006_159.png "qqqqqqqqqqq")

{% include references.md %}
