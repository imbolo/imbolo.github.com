---
layout: page
title: 菠萝先森的个人博客
tagline: 做一个技术精湛的菠萝
---
{% include JB/setup %}

## 最近文章
<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>



