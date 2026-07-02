---
layout: default
title: Blog
description: Insights on AI marketing, SEO, and digital strategy
permalink: /blog/
---

<div class="section-header" style="text-align:left;margin-bottom:40px;">
    <span class="section-tag">Blog</span>
    <h1 class="section-title">Latest <span class="gradient-text">Posts</span></h1>
    <p class="section-desc">Insights on AI marketing, SEO, and digital strategy.</p>
</div>

<div class="blog-list">
    {% for post in site.posts %}
    <article class="blog-card">
        <p class="blog-meta">{{ post.date | date: "%b %Y" }} · {{ post.readTime | default: "3 min read" }}</p>
        <h2 class="blog-title"><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></h2>
        <p class="blog-desc">{{ post.description }}</p>
        <a href="{{ site.baseurl }}{{ post.url }}" class="blog-read-more">Read Post <i class="fas fa-arrow-right"></i></a>
    </article>
    {% endfor %}
</div>

<style>
.blog-list { display: flex; flex-direction: column; gap: 24px; max-width: 720px; }
.blog-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 28px; transition: all var(--transition-fast); }
.blog-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: var(--accent-primary); }
.blog-card .blog-meta { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px; }
.blog-card h2 { font-family: var(--font-display); font-size: 1.2rem; margin-bottom: 8px; }
.blog-card h2 a { color: var(--text-primary); text-decoration: none; }
.blog-card h2 a:hover { color: var(--accent-primary); }
.blog-card .blog-desc { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; margin-bottom: 12px; }
.blog-card .blog-read-more { color: var(--accent-primary); font-size: 0.85rem; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
.blog-card .blog-read-more:hover { gap: 10px; }
</style>
