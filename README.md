oni-exdoc
=============
avalon.oniui的示例源代码生成器

### 使用方式 ###
__注意 avalon. *component* .ex*.html 中一定要有pre标签__

####一、扫描目录 ####
    $ oni-exdoc ./
    $ oni-exdoc ./carousel
会递归扫描路径下所有avalon. *component* .ex*.html, 并在pre标签中插入源代码

#### 二、扫描文件 ####
    $ oni-exdoc ./avalon.carousel.ex.html
在该文件的pre标签中插入源代码