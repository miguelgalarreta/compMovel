
function showEntry(titulo, link, contenido) {
	var div = document.createElement("div");
	$(
			'<div>',
			{
				// id:
				class : "entryDiv",
				html : "<h2><a href=" + link + ">" + titulo + "</a></h2>"
						+ contenido + "<br/>",
			// style: "float: left; width :" + widthDiv + "px;"
			// }).css({borderWidth: '6px'}).appendTo('#mosaicDiv');
			}).appendTo('#' + containerContent);
}

function feedLoaded(results) {
	console.log("loading feed");
	if (!results.error) {
		console.log("not error");
		document.getElementById(containerContent).innerHTML = "";
		var feedrows = [];
		var n = 0
		for ( var i = 0; i < results.feed.entries.length; i++) {
			var entry = results.feed.entries[i];

			var ftitulo = entry.title;
			var flink = entry.link;
			var fcontenido = entry.content;

			var row = ftitulo + "###" + flink + "###" + fcontenido + "###";
			showEntry(ftitulo, flink, fcontenido);
			feedrows[n++] = row;
		}
		window.localStorage.setItem("jornalUSP", feedrows.join(";;;"));// save
																		// rss
	} else {
		console.log("lecture error");
		document.getElementById(containerContent).innerHTML = "erro de coneção";
	}
}

function loadRssmk() {
	document.getElementById(containerContent).innerHTML = "carregando...";
	console.log("before rss");
	// test internet connection
	var networkState = navigator.connection.type;
	// alert("stado " + networkState);
	if (networkState == Connection.NONE)// there is not connection
	{
		console.log("no internet");
		var rsscache = window.localStorage.getItem("jornalUSP");
		if (rsscache == null)
			{
			alert("Sem coneção a internet nem dados armazenados na cache.");
			document.getElementById(containerContent).innerHTML = "Sem coneção a internet nem dados armazenados na cache."
			}
		else {
			document.getElementById(containerContent).innerHTML = "";
			var feedArray = rsscache.split(";;;");
			for ( var i in feedArray) {
				var tagsArray = feedArray[i].split("###");
				showEntry(tagsArray[0], tagsArray[1], tagsArray[2]);
			}
		}
	} else {// internet connection
		var feed = new google.feeds.Feed(rssJornal);
		feed.load(feedLoaded);
	}
}