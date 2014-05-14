///import js.dom.INodeEvent;
///import elf.~shortcut.~dispatcher.string;
///import elf.~shortcut.~dispatcher.function;
///import elf.~shortcut.loadScript;
///import elf.~shortcut.template;
///import elf.~shortcut.ajax;
///import elf.~namespace.URL;

var site = {
	InitMap: {
	//	list: function () {
	//		site.VAR_AUTO_LOAD_ON_SCROLL && elf(window).on('scroll', site.Handlers.scrolling);
	//	},
		
		post: function () {
			var disqusUrl = site.URL_DISCUS_COMMENT;
			disqusUrl && elf().loadScript(disqusUrl, {});
		},
		
		search: function () {
			site.URL_GOOGLE_API &&
			site.VAR_GOOGLE_CUSTOM_SEARCH_ID &&
			elf().loadScript(site.URL_GOOGLE_API, {
				onload: site.Handlers.onGCSEAPILoad
			});
		}
	},
	
	Handlers: {
		deferLoad: function () {
			elf('article').toArray()
				.filter(site.Util.isViewable)
				.filter(function (item) {
					return item.getAttribute('content-loaded') != 1;
				}).slice(0, site.VAR_AUTO_LOAD_ON_SCROLL).forEach(site.Handlers.loadArticle);
			
		},
		
		loadArticle: function (item) {
			elf().ajax({
				url: elf(item).firstChild().firstChild().attr('href'),
				onsuccess: function (response) {
					site.Handlers.showAjaxContent(item, response);
				}
			});
		},
		
		showAjaxContent: function (node, response) {
			var article = elf(node);
			var content = response.split('<p class="meta">')[1].split('</p>');
			content.shift();
			content = content.join('</p>');
			content = content.split(/<\/article>/)[0];
			article.query('>.article-content').html(content);
			article.attr('content-loaded', 1);
			article.query('pre').forEach(function (item) {
				hljs.highlightBlock(item);
			});
		},
		
		scrolling: function () {
			var timer = site.scrollingTimer;
			if (timer) {
				clearTimeout(timer);
			}
			site.scrollingTimer = setTimeout(site.Handlers.deferLoad, 1000);
		},
		
		onGCSEAPILoad: function () {
			google.load('search', '1', {
				language: 'zh-CN',
				style: google.loader.themes.V2_DEFAULT,
				callback: site.Handlers.onGCSEReady
			});
		},
		
		onGCSEReady: function() {
			var customSearchControl = new google.search.CustomSearchControl(site.VAR_GOOGLE_CUSTOM_SEARCH_ID, {});
			customSearchControl.setResultSetSize(google.search.Search.FILTERED_CSE_RESULTSET);
			
			var options = new google.search.DrawOptions();
			options.setAutoComplete(true);
			customSearchControl.draw('cse', options);
			
			var url = new elf.URL(location);
			var query = url.getParameter('q');
			if (query) {
				query = decodeURIComponent(query);
				document.title = elf().template(
					site.TPL_SEARCH_TITLE,
					site.VAR_SITE_NAME,
					query
				);
				customSearchControl.execute(query);
			}
		}
	},
	
	Util: {
		
		isViewable: function (element) {
			var pos = element.getBoundingClientRect();
			var doc = js.dom.Stage.getDocumentElement();
			var winHeight = doc.clientHeight;
			var winWidth = doc.clientWidth;
			var scrollLeft = document.body.scrollLeft || doc.scrollLeft;
			var scrollTop = document.body.scrollTop || doc.scrollTop;
			
			return (pos.right > 0 &&
				pos.left < winWidth &&
				pos.bottom > 0 &&
				pos.top < winHeight);
		}
	}
};


elf(function () {
	hljs.initHighlighting();
	
	var module = document.body.className.replace(/page-type-/g, '').split(' ');
	module.forEach(function (item) {
		var initer = site.InitMap[item];
		initer && elf(initer);
	});
});
/*
$("#back-top").hide();
$(document).ready(function () {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('#back-top').fadeIn();
    } else {
      $('#back-top').fadeOut();
    }
  });
  $('#back-top a').click(function () {
    $('body,html').animate({
      scrollTop: 0
    }, 800);
    return false;
  });
});
*/

$(document).ready(function(){
//首先将#back-to-top隐藏
 $("#back-top").hide();
//当滚动条的位置处于距顶部100像素以下时，跳转链接出现，否则消失
$(function () {
$(window).scroll(function(){
if ($(window).scrollTop()>100){
$("#back-top").fadeIn(1500);
}
else
{
$("#back-top").fadeOut(1500);
}
});
//当点击跳转链接后，回到页面顶部位置
$("#back-top").click(function(){
$('body,html').animate({scrollTop:0},1000);
return false;
});
});
});