define({
    url: 'http://jasonmoran.com/shows.html',
    scraper: function () {
        $ = jQuery;
        $('tr:nth-child(1) td').remove();
        var data = [];
        $('tr').each(function(index, elem) {
            if($('td', elem).eq(0).text().length > 1) {
                data.push({
                    date : $('td', elem).eq(0).text(),
                    city : $('td', elem).eq(1).text(),
                    info : $('td', elem).eq(2).text()
                });
            }
        });
        return data;
    }
});
