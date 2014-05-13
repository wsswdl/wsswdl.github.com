---
layout: post
title: 在github上搭建个人博客
category: default
---

#文章内容

###1.注册git账号##

###2.创建一个项目##

###3.密钥设置##

###4.下载我的代码##

###5.安装jekyll##

###6.修改自己的博客##

###7.上传代码，生成自己的博客##

####1.注册git账号##
打开[github](https://github.com/ "github官网")官网，注册一个账号，将我们自己的代码托管在github上。

注册该站点有两个目的:

    托管我们的开源项目;

    在上面建个静态博客吧。

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

<!--more-->

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
