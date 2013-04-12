var storage = window.localStorage;
var offset=0;
var rssJornal='http://espaber.uspnet.usp.br/jorusp/?feed=rss2';
var entries = [];
var selectedEntry = "";

//listen for detail links
//$(".contentLink").click(function()) .on("click", function() {
//	selectedEntry = $(this).data("entryid");
//});

function loadFeed(n,max,offset) {
	$('#contentDiv').html('Carregando ...');
	$(document).ready(function () {
		//connection testing
		//var api = "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=" + encodeURIComponent(url);
		
		$('#contentDiv').rssfeed(rssJornal);//,{n,offset,max}
	});
};
function renderEntries(entries) {
    var s = '';
    $.each(entries, function(i, v) {
        s += '<li><a href="#contentPage" class="contentLink" data-entryid="'+i+'">' + v.title + '</a></li>';
    });
    $("#linksList").html(s);
    $("#linksList").listview("refresh");
}
function loadRss()
{
	//loading rss
	var feed = new google.feeds.Feed(rssJornal);
//	$.mobile.showPageLoadingMsg();
	feed.load(function(result) {
//		$.mobile.hidePageLoadingMsg();
		if(!result.error) {
			entries = result.feed.entries;
			localStorage["entries"] = JSON.stringify(entries);
			renderEntries(entries);
		} else {
			console.log("Error - "+result.error.message);
			if(localStorage["entries"]) {
				$("#status").html("Using cached version...");
				entries = JSON.parse(localStorage["entries"]);
				renderEntries(entries);
			} else {
				$("#status").html("Não foi possível descarregar a pagina nem tem informação na cache.");
			}
		}
	});
}


//Listen for the content page to load
$("#contentDiv").on("pageshow", function(prepage) {
	//Set the title
	$("h1", this).text(entries[selectedEntry].title);
	var contentHTML = "";
	contentHTML += entries[selectedEntry].content;
	contentHTML += '<p/><a href="'+entries[selectedEntry].link + '" class="fullLink" data-role="button">Read Entry on Site</a>';
	$("#entryText",this).html(contentHTML);
	$("#entryText .fullLink",this).button();

});