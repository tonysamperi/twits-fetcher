$.fn.twitterFetcher = function (settings) {
	settings = jQuery.extend({
		uniqueId: null,
		widgetid: null,
		maxTweets: 20,
		enableLinks: true,
		showFollowers: true,
		showImages: false,
		showRetweet: true,
		lang: "it",
		enablePermalink: false
	}, settings);

	if (typeof settings.widgetid === "undefined" || settings.widgetid === null) {
		console.error("TWITLINE: WIDGETID MUST BE DEFINED!");
		return false;
	}

	var $target = $(this);

	var strTrim = function (t, l) {
		t = t.substring(0, l);
		return(t);
	};

	window.twtCallback = function (response) {
		function datefix(d) {
			d = new Date(d);
			var hh = (d.getHours()) > 9 ?
			(d.getHours()) : "0" + (d.getHours());
			var mm = (d.getMinutes()) > 9 ?
			(d.getMinutes()) : "0" + (d.getMinutes());
			var day = (d.getDate() + 1) > 9 ?
			(d.getDate() + 1) : "0" + (d.getDate() + 1);
			var month = d.getMonth();
			var month_it = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
			var month_en = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dec"];
			month = settings.lang === "it" ? month_it[month] : month_en[month];
			var d = day + " " + month + " alle" + hh + ":" + mm;
			return d;
		}
		function w(a) {
			return a.replace(/<b[^>]*>(.*?)<\/b>/gi, function (a, f) {
				return f;
			}).replace(/class=".*?"|data-query-source=".*?"|dir=".*?"|rel=".*?"/gi, "");
		}
		var list = $(response.body).find("ol.h-feed > li");
		var user = list.find(".p-nickname").first().text().substr(1);
		var userLink = list.find(".profile").first().attr("href");
		var a = [], b = [], c1 = [], c2 = [], d = [], e = [], f= [];
		list.each(function () {
			var cur = $(this);
			if (!settings.showRetweet &&
				cur.find(".p-author").html().indexOf(user) === -1)
				return true;
			var shortUrl = cur.find('a[data-scribe="element:url"]');
			if (shortUrl.length > 0) {
				shortUrl = shortUrl.attr("href");
				cur.find('a[data-scribe="element:url"]').empty().append(shortUrl);
			}
			a.push(cur.find(".e-entry-title").html());
			b.push(cur.find(".data-tweet-id"));
			c1.push(cur.find(".p-author").find("img").attr("src"));
			c2.push(cur.find(".full-name").html());
			d.push(datefix(cur.find(".dt-updated").attr("datetime")));
			e.push(cur.find(".inline-media").html());
			f.push(cur.find(".permalink").attr("href"));
			if (a.length === parseInt(settings.maxTweets))
				return false;
		});
		
		var html = '<div class="twt-ct">\n';
		
		for (var i = 0; i < a.length; i++) {
			html += '<div class="twt-item row">\n' +
				'<div class="twt-img-ct col-lg-1 col-md-1 col-sm-1 col-xs-12">\n'+
					'<a target="_blank" href="'+userLink+'">\n'+
						'<img src="' + c1[i] + '"/>\n'+
					'</a>\n' +
				'</div>\n'+
				'<div class="col-lg-10 col-md-10 col-sm-10 col-xs-12">\n'+
					'<div class="twt-row row">\n'+
						'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\n'+
							'<a target="_blank" href="'+userLink+'">\n'+
								c2[i] + '\n' +
							'</a>\n&nbsp;-&nbsp;\n';
			
				if(settings.permalink===true){
			 		html += '<a class="permalink" href="'+f[i]+'">\n' +
		 				'<span class="twt-date">' + d[i] + '</span>\n'+
			 			'</a>\n';
				}
				else{
			 		html += '<span class="twt-date">' + d[i] + '</span>\n';
		 		}
		 		html+='</div>\n'+
		 		'</div>\n'+
			 	'<div class="twt-row row">\n'+
			 		'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\n'+
			 		 	w(a[i]) + '\n' +
		 		 	'</div>\n';
					if(settings.showImages===true){
				 		html+=e[i];
				 	}
 		 		html+= '</div>\n';
			 	html+='</div>\n'+
			 	'</div>\n';
		}
		
		html += "</div>";
		$(html).find("*").removeAttr("data-scribe");
		$target.append(html);

	};

	return this.each(function () {
		var protocol = window.location.protocol==="https:"? "https":"http"
		var c = document.createElement("script");
		c.type = "text/javascript";
		c.src = protocol+"://cdn.syndication.twimg.com/widgets/timelines/" + settings.widgetid +"?&lang=" + (settings.lang || "en") +
		 "&callback=twtCallback&suppress_response_codes=true&rnd=" +Math.random();
		c.onerror = function () {
			if (typeof settings.uniqueId === "undefined" || settings.uniqueId === null) {
				$(window).trigger("twt-error-" + settings.uniqueId);
			}
			console.warn("GET TWITS ERROR!");
		};
		c.onload = function () {
			console.info("GET TWITS OK!");
		};
		c.onreadystatechange = function () {
			console.info("RSC: ", this.status);
		};
		document.getElementsByTagName("head")[0].appendChild(c);
	});
};