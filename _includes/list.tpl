{% include header.tpl %}

{% for post in list %}
<article{% if forloop.index == 1 and preview %} content-loaded="1"{% endif %}>
	<h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
	{% include meta.tpl %}
	<div class="article-content">
	{% if forloop.index == 1 and preview and post.layout == 'post' %}
		{{ post.content | split:"<!-- more -->" | first | strip_html | truncate:300 }}
		{% if post.content | size > 300 %}
			<strong>Read more</strong>
		{% endif %}
	{% endif %}
	</div>
</article>
{% endfor %}

{% if list == null %}
<article class="empty">
	<p>该分类下还没有文章</p>
</article>
{% endif %}