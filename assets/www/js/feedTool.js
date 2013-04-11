var storage = window.localStorage;
var offset=0


$.fn.getRss = function(url, options) {
    // Create Google Feed API address
    var api = "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=" + encodeURIComponent(url);
    api += "&num=10";
    api += "&output=json_xml";

    return this.each(function(i, e) {
        var $e = $(e);

        // Send request 
        $.getJSON(api, function(data) {
            if (data.responseStatus == 200) {
                _process(e, data.responseData, options);
            }
            else {
                var msg = data.responseDetails;

                if (typeof(Storage) !== "undefined") {
                    if (storage.getItem("noticias")) {
                        var rowArray = [];
                        var noticias = storage.getItem("noticias").split(';');
                        for (var i = 0; i < noticias.length; i++) {
                            var row = noticias[i].split("#");
                            row['title'] = row[0];
                            row['feedLink'] = row[1];
                            row['content'] = row[2];
                            row['content2'] = row[3];
                            row['pubDate'] = row[4];

                            options.offset = 0;

                            rowArray[i] = row;
                        }
                        _escreveFeed(e, rowArray, options);
                    }
                    else {
                        $(e).html('<div class="rssError"><p>' + msg + '</p></div>');
                    }
                }
                else {
                    $(e).html('<div class="rssError"><p>' + msg + '</p></div>');
                }
            }
        });
    });
};

var _process = function(e, data, options) {    
    var feeds = data.feed;
    if (!feeds) {
        return false;
    }
    var rowArray = [];
    var rows = [];
    var j = 0;
    var tam = options.offset + options.limit;
    if (tam > options.limit_max) {
        tam = options.limit_max;
    }


    for (var i = options.offset; i < tam; i++) {
        var entry = feeds.entries[i];
        var row = new Array();        
        row['title'] = entry.title;
        row['feedLink'] = entry.link;
        row['content'] = entry.contentSnippet;
        row['content2'] = entry.content;

        // Format published date
        if (entry.publishedDate) {
            var entryDate = new Date(entry.publishedDate);

            row['pubDate'] = _formatDate(entryDate, 'dd de MMMM de yyyy hh:mm');
        }
        rowArray[i] = row;
        //rows[j++] = row['title'] + '#' + row['feedLink'] + '#' + row['content'] + '#' + row['content2'];
        rows[j++] = row['title'] + '#' + row['feedLink'] + '#' + row['content'] + '#' + '#' + row['pubDate'];
    }

    if (typeof(Storage) !== "undefined") {
        storage.setItem("noticias", rows.join(";"));
    }
    else {
        alert('Sorry! No web storage support..');
    }

    _escreveFeed(e, rowArray, options);
};


var _formatDate = function(date, mask) {

    // Convert to date and set return to the mask
    var fmtDate = new Date(date);
    date = mask;



    // Replace mask tokens
    date = date.replace('dd', _formatDigit(fmtDate.getDate()));
    date = date.replace('MMMM', _getMonthName(fmtDate.getMonth()));
    //date = date.replace('MM', _formatDigit(fmtDate.getMonth()+1));
    date = date.replace('yyyy', fmtDate.getFullYear());
    date = date.replace('hh', _formatDigit(fmtDate.getHours()));
    date = date.replace('mm', _formatDigit(fmtDate.getMinutes()));
    //date = date.replace('ss', _formatDigit(fmtDate.getSeconds()));

    return date;
}

var _formatDigit = function(digit) {
    digit += '';
    if (digit.length < 2)
        digit = '0' + digit;
    return digit;
}

var _getMonthName = function(month) {
    var name = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return name[month];
}

var _escreveFeed = function(e, rowArray, options) {
    var html = '';
    var row = 'odd';
    var tam = options.offset + options.limit;
    if (tam > options.limit_max) {
        tam = options.limit_max;
    }


    // Add body
    html += '<div class="rssBody">' +
            '<ul>';
    for (var i = options.offset; i < tam; i++) {
        html += '<li class="rssRow ' + row + '">';
        html += '<h4><a href="' + rowArray[i]['feedLink'] + '" title="Veja esta notícia em ' + rowArray[i]['title'] + '">' + rowArray[i]['title'] + '</a></h4>';
        html += '<div>' + rowArray[i]['pubDate'] + '</div>';
        html += '<p>' + rowArray[i]['content'] + '</p>';
        html += '</li>';

        // Alternate row classes
        if (row == 'odd') {
            row = 'even';
        } else {
            row = 'odd';
        }
    }

    html += '</ul>' +
            '</div>'


    $(e).html(html);
}
