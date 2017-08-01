(function ($) {
	var script = null;
	var twtCount = 0;
	window.__twttrf = {
		
	};
	
    var genericError = {
        it: "Si è verificato un errore tecnico. Non è possibile caricare i Twits!",
        en: "A technical error has occoured. Cannot load Twits!",
        es: "Se ha producido un error técnico. No se puede cargar los Twits!"
    };
    /* SHARED FUNCTIONS */
    var closeBox = function(){
        var el = $(this).parents(".twit-fetcher-container");
		el.fadeOut(undefined,function(){
		  el.remove();
		});
    };
    var generateErrorBox = function(text){
        return '<div class="twit-fetcher-errorBox"><img class="twit-fetcher-close" src="./twits-fetcher/closeIcon.png" alt="Close"/><p>' + text + '</p></div>';
    };

    var generateSpinner = function(){
        return '<div class="twit-fetcher-spinner"><img src="./twits-fetcher/spinner.gif" alt="Loading..."/></div>';
    };

    var generateYTframe = function (src,columnsClass) {
        return '<div class="'+columnsClass+'"><div class="iframect"><iframe scrolling="no" frameborder="0" allowtransparency="true"' +
            'src="' + src + '?autoplay=1" allowfullscreen="true" ' +
            'title="Media Player" class="FilledIframe"></iframe></div></div>';
    };
    var decodeUrl = function (t) {
        var e = t.split(" ");
        this.url = decodeURIComponent(e[0].trim()),
            this.width = +e[1].replace(/w$/, "").trim()
    };
    var checkDevice = function (t, e, n) {
        var i, o, a, s, h = window;
        if (t = h.devicePixelRatio ? t * h.devicePixelRatio : t,
                o = e.split(",").map(function (t) {
                    return new decodeUrl(t.trim())
                }),
                n)
            for (s = 0; s < o.length; s++)
                o[s].url === n && (i = o[s]);
        return a = o.reduce(function (e, n) {
            return n.width < e.width && n.width >= t ? n : e
        }, o[0]),
            i && i.width > a.width ? i : a
    };

    var fixSrc = function (img) {
        var n;
		var srcSet = $(img).attr("data-srcset");
		var o = $(img).attr("src");
        if (!!srcSet) {
            n = checkDevice($(window).width(), srcSet, o);
            return n.url;
        }
        return "";
    };
    var imageExists = function (src) {

        var deferred = $.Deferred();

        var image = new Image();
        image.onerror = function () {
            deferred.resolve(false);
        };
        image.onload = function () {
            deferred.resolve(true);
        };
        image.src = src;

        return deferred;
    };
    var datefix = function (dateString, lang) {
        var dateStringISO = dateString.replace(/([+\-]\d\d)(\d\d)$/, "$1:$2");
        d = new Date(dateStringISO);
        var hh = (d.getHours()) > 9 ?
            (d.getHours()) : "0" + (d.getHours());
        var mm = (d.getMinutes()) > 9 ?
            (d.getMinutes()) : "0" + (d.getMinutes());
        var day = (d.getDate() + 1) > 9 ?
            (d.getDate()) : "0" + (d.getDate());
        var month = d.getMonth();
        var months = {
            it: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
            en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            es: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        };
        if (!!months[lang] && !!months[lang][month])
            month = months[lang][month];
        else
            month = months["en"][month];
        var at = {
            it: " alle ",
            en: " at ",
            es: " a las "
        };
        var at = !!at[lang] ? at[lang] : at["en"];
        var d = day + " " + month + at + hh + ":" + mm;
        return d;
    };
    var strTrim = function (t, l) {
        t = t.substring(0, l);
        return (t);
    };
    var w = function (a) {
        return a.replace(/<b[^>]*>(.*?)<\/b>/gi, function (a, f) {
            return f;
        }).replace(/class=".*?"|data-query-source=".*?"|dir=".*?"|rel=".*?"/gi, "");
    };

    var  twtCallback = function (response, settings, $target) {

        var list = $(response.body).find('*[data-scribe="component:tweet"]');
        var user = [], usrLnk = [], usrName = [], a = [], b = [], avatarImg = [], d = [], e = [], p = [];

        list.each(function () {
            var cur = $(this);

            user.push(cur.find("[data-scribe='element:name']").text());
            usrLnk.push(cur.find("[data-scribe='element:user_link']").attr("href"));

            var retweet = cur.find(".retweet-credit").html() != undefined;

            if (!settings.showRetweet && retweet) {
                return true;
            }

            var shortUrl = cur.find('a[data-scribe="element:url"]');
            if (shortUrl.length > 0) {
                shortUrl = shortUrl.attr("href");
                //shortUrl = strTrim(shortUrl, 50) + "...";
                cur.find('a[data-scribe="element:url"]').empty().append(shortUrl);
            }
            var postContent = $(cur.find(".timeline-Tweet-text"));
            var postLinks = postContent.find("a");

            postLinks.each(function () {
                var extRef = $(this).attr("data-expanded-url");
                if (!!extRef) {
                    $(this).attr("href", extRef);
                    $(this).html(extRef);
                }
            });


            a.push(postContent.html());
            b.push(cur.find(".data-tweet-id"));

            avatarImg.push(
                settings.avatar !== "default" ?
                    settings.avatar : cur.find("[data-scribe='element:avatar']").attr("data-src-1x")
            );

            p.push(cur.find('[data-scribe="element:mini_timestamp"]').attr("href"));
            usrName.push(cur.find('[data-scribe="element:screen_name"]').html());
            d.push(datefix(cur.find(".dt-updated").attr("datetime"), settings.lang));
            if (settings.showImages === true) {
                var row = $('<div class="row"></div>');
                var media = $(cur.find("div.MediaCard-media"));
                media.find("footer").remove();
                var media = media.find("a").not('[role="presentation"]');
                var countMedia = media.length;
                var columnsClass = countMedia > 1 ? "col-xs-6" : "col-xs-10 col-xs-offset-1";
                var columnHtml = '<div class="' + columnsClass + '"></div>';
                media.each(function (index) {
                    var elem = $(this);
                    elem.attr("target","_blank");
                    var playerSrc = elem.attr("data-player-src");
                    if (!!playerSrc) {
                        if (playerSrc.indexOf("youtube") >= 0) {
                            $("body").one("click", '[data-scribe="element:play_button"]', function (event) {
                                event.preventDefault();
                                var target = $(event.target).parents(".row:first");
                                target.empty().append(generateYTframe(playerSrc,columnsClass));
                            });
                            var mediaResult = $(columnHtml).append(elem.html());
                            row.append(mediaResult);
                        }
                        return true;
                    }
                    var mediaResult = elem.wrap(columnHtml);
                    if (index === countMedia - 1) {
                        if (countMedia % 2 !== 0 && countMedia > 1) {
                            elem.parent().addClass("col-offset-xs-3");
                        }
                    }
                    innerImg = elem.find("img");
                    var fixedSrc = fixSrc(innerImg);
                    if (fixedSrc !== "")
                        innerImg.attr("src", fixedSrc);
                    else {
                        elem.remove();
                        return true;
                    }
                    row.append(mediaResult);
                });

                e.push(row[0].outerHTML);
            }
            if (a.length === parseInt(settings.maxTweets))
                return false;
        });

        var html = '<div class="twt-ct">\n';

        for (var i = 0; i < a.length; i++) {
            html += '<div class="twt-item row">\n' +
                '<div class="twt-img-ct col-lg-1 col-md-1 col-sm-1 col-xs-12">\n' +
                '<a target="_blank" href="' + usrLnk[i] + '">\n' +
                '<img src="' + avatarImg[i] + '"/>\n' +
                '</a>\n' +
                '</div>\n' +
                '<div class="col-lg-10 col-md-10 col-sm-10 col-xs-12">\n' +
                '<div class="twt-row row">\n' +
                '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\n' +
                '<a target="_blank" href="' + usrLnk[i] + '">\n' +
                usrName[i] + '\n' +
                '</a>\n&nbsp;-&nbsp;\n';

            if (settings.enablePermalink === true) {
                html += '<a class="permalink" href="' + p[i] + '">\n' +
                    '<span class="twt-date">' + d[i] + '</span>\n' +
                    '</a>\n';
            }
            else {
                html += '<span class="twt-date">' + d[i] + '</span>\n';
            }
            html += '</div>\n' +
                '</div>\n' +
                '<div class="twt-row row">\n' +
                '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\n' +
                '<p class="timeline-Tweet-text">' + w(a[i]) + '</p>\n';
            if (settings.showImages === true && e[i] !== null) {
                html += e[i];
            }
            html += '</div>\n';
            html += '</div>\n';
            html += '</div>\n' +
                '</div>\n';
        }

        html += "</div>";
        $(html).find("*").removeAttr("data-scribe");
        $target.append(html);

    };

    $.fn.twitterFetcher = function (settings) {
		
        settings = jQuery.extend({
            avatar: "default",
            uniqueId: null,
            widgetid: null,
            maxTweets: 20,
            enableLinks: true,
            showImages: false,
            showRetweet: true,
            lang: "it",
            enablePermalink: false
        }, settings);

        if (typeof settings.widgetid === "undefined" || settings.widgetid === null) {
            console.error("TWITLINE: WIDGETID MUST BE DEFINED!");
            return false;
        }

        if (settings.avatar !== "default" && !imageExists(settings.avatar)) {
            settings.avatar = "default";
            console.warn("Invalid avatar override: setting default avatar");
        }

        return this.each(function () {
            twtCount++;
			var $target = $(this);
            $target.addClass("twit-fetcher-container");
            var spinner = $(generateSpinner());
            $target.append(spinner);
            var protocol = window.location.protocol === "https:" ? "https" : "http";
			var callbackProp = "callback"+twtCount;
			window.__twttrf[callbackProp] = function(data){
				console.info("TWT CALLBACK DATA", data);
				spinner.fadeOut();
				twtCallback(data, settings, $target);
			};
			
            var url = protocol + "://cdn.syndication.twimg.com/widgets/timelines/" + settings.widgetid + "?&lang=" + (settings.lang || "en") +
                "&callback=__twttrf." + callbackProp + "&suppress_response_codes=true&rnd=" + Math.random();
				
			var url2 = protocol + "://cdn.syndication.twimg.com/widgets/timelines/" + "502160051226681344" + "?&lang=en&callback=__twttrf.callback&suppress_response_codes=true&rnd=0.5226350122345014"
			
			var url3 = protocol + "://cdn.syndication.twimg.com/widgets/timelines/" + "502160051226681344" + "?&lang=en&callback=__twtcbs.callback&suppress_response_codes=true&rnd=0.5226350122345014"
				
            /*$.ajax({
                url: url,
                contentType: 'application/json',
                cache: 'true',
                dataType: 'json'
            })
			*/
			/*$.getJSON(url).done(function (data) {
                if(data.headers.status === 404){
                    var error = data.headers.message || genericError[settings.lang || "en"];
                    $target.empty().append(generateErrorBox(error));
                    $("body").off("click.twitsFetcher").on("click.twitsFetcher",".twit-fetcher-close", closeBox);
                    return;
                }
                twtCallback(data, settings, $target);
                spinner.fadeOut();
            });*/
			
			var head = document.getElementsByTagName("head")[0];
			if(script !== null){
				head.removeChild(script);
			}
			script = document.createElement("script");
			script.type = "text/javascript";
			script.onerror = function(a){
				console.info("TFERROR", a);
				var error = genericError[settings.lang || "en"];
				$target.empty().append(generateErrorBox(error));
				$("body").off("click.twitsFetcher").on("click.twitsFetcher",".twit-fetcher-close", closeBox);
			}

			script.src = url;
			head.appendChild(script);

            return false; //PREVENT USING COLLECTIONS
        });
    };

})(jQuery);
