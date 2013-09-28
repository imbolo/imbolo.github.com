---
layout: page
title: 菠萝先森的博客
tagline: 做一个技术精湛的菠萝
---
{% include JB/setup %}

## 最近文章
<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date: "%Y年%m月%d日" }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>



