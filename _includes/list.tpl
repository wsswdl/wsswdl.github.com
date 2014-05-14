{% include header.tpl %}

{% for post in list %}
<article{% if forloop.index == 1 and preview %} content-loaded="1"{% endif %}>
	<h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
	{% include meta.tpl %}
	<div class="article-content">
	{% if post.layout == 'post' %}
		{{ post.content | split:"<!-- more -->" | first | strip_html | truncate:300 }}
			{% if post.content | size > 300 %}
				<a href="{{ post.url }}"><strong>Read more</strong></a>
			{% endif %}

	{% endif %}
	{% if page.title %}
		<!-- JiaThis Button BEGIN -->
		<div class="jiathis_style">
		<a class="jiathis_button_qzone"></a>
		<a class="jiathis_button_tsina"></a>
		<a class="jiathis_button_tqq"></a>
		<a class="jiathis_button_weixin"></a>
		<a class="jiathis_button_renren"></a>
		<a href="http://www.jiathis.com/share" class="jiathis jiathis_txt jtico jtico_jiathis" target="_blank"></a>
		<a class="jiathis_counter_style"></a>
		</div>
		<script type="text/javascript" src="http://v3.jiathis.com/code/jia.js?uid=1376318876580714" charset="utf-8"></script>
	<!-- JiaThis Button END -->

	{% endif %}
	</div>
</article>
{% endfor %}

{% if list == null %}
<article class="empty">
	<p>该分类下还没有文章</p>
</article>
{% endif %}