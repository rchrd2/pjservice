define({
    url: "http://marklevine.com/itinerary.html",
		scraper: function () {
        var data = [];

        var curr_month_year = '';
        var curr_month = '';
        var curr_year = '';
        var curr_date = '';
        var curr_info = '';
        var curr_location = '';
        var curr_venue = '';
        var curr_row = {};

        var itinary_table = jQuery('td[colspan=3]').parents('table');

        jQuery('*', itinary_table).each(function(index, elem){
            $elem = jQuery(elem);

            if($elem.is('tr')) {

                if( jQuery('td[colspan=3]', $elem).length > 0) {
                    curr_month_year = $elem.text();
                    var month_year_array = curr_month_year.split(" ");
                    curr_month = month_year_array[0];
                    curr_year = month_year_array[1];
                } else {
                    curr_date = curr_month + " " + jQuery('td:nth-child(1)', $elem).text() + ", " + curr_year;
                    curr_info = jQuery('td:nth-child(2)', $elem).text();
                    curr_location = jQuery('td:nth-child(3)', $elem).html();
                    curr_venue = jQuery('td:nth-child(3) a', $elem).html();
                    curr_row.date = curr_date;
                    curr_row.info = curr_info;
                    curr_row.location = curr_location;
                    curr_row.venue = curr_venue;
                    data.push(curr_row);
                    curr_row = {};
                }
            }
        });
        return data;
    }
});
