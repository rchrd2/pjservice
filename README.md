Pjservice turns pjscrape into a service component.

It uses `polipo` for caching. On a mac install with `brew install polipo`.



# Usage

## Curl example

Not super useful, but it shows that the module needs to be url-encoded. 
You can url-encode here. http://www.url-encode-decode.com/

I found a tool in the mac App Store called "Rested" that makes it easy to test.
There's a gotcha. Rested has a max 180s timeout so curl is still necessary at times.

```
curl --url "http://localhost:1234" -X POST --data "token=lemons&module=define%28%7B%0Aurl%3A%20%22http%3A%2F%2Fmarklevine.com%2Fitinerary.html%22%2C%20scraper%3A%20function%20%28%29%20%7B%0A%20%20%20%20var%20data%20%3D%20%5B%5D%3B%0A%20%20%20%20%0A%20%20%20%20var%20curr_month_year%20%3D%20%27%27%3B%0A%20%20%20%20var%20curr_month%20%3D%20%27%27%3B%0A%20%20%20%20var%20curr_year%20%3D%20%27%27%3B%0A%09var%20curr_date%20%3D%20%27%27%3B%0A%20%20%20%20var%20curr_info%20%3D%20%27%27%3B%0A%20%20%20%20var%20curr_location%20%3D%20%27%27%3B%0A%09var%20curr_venue%20%3D%20%27%27%3B%0A%20%20%20%20%0A%09var%20curr_row%20%3D%20%7B%7D%3B%0A%09%0A%20%20%20%20var%20itinary_table%20%3D%20%24%28%27td%5Bcolspan%3D3%5D%27%29.parents%28%27table%27%29%3B%0A%20%20%20%20%0A%09%24%28%27%2A%27%2C%20itinary_table%29.each%28function%28index%2C%20elem%29%7B%0A%09%09%24elem%20%3D%20%24%28elem%29%3B%0A%09%0A%20%20%20%20%20%20%20%20if%28%24elem.is%28%27tr%27%29%29%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20if%28%20%24%28%27td%5Bcolspan%3D3%5D%27%2C%20%24elem%29.length%20%3E%200%29%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20curr_month_year%20%3D%20%24elem.text%28%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20var%20month_year_array%20%3D%20curr_month_year.split%28%22%20%22%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20curr_month%20%3D%20month_year_array%5B0%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20curr_year%20%3D%20month_year_array%5B1%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20curr_date%20%3D%20curr_month%20%2B%20%22%20%22%20%2B%20%24%28%27td%3Anth-child%281%29%27%2C%20%24elem%29.text%28%29%20%2B%20%22%2C%20%22%20%2B%20curr_year%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20curr_info%20%3D%20%24%28%27td%3Anth-child%282%29%27%2C%20%24elem%29.text%28%29%3B%0A%20%20%20%20%09%09%20%20%20%20curr_location%20%3D%20%24%28%27td%3Anth-child%283%29%27%2C%20%24elem%29.html%28%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20curr_venue%20%3D%20%24%28%27td%3Anth-child%283%29%20a%27%2C%20%24elem%29.html%28%29%3B%0A%09%09%09%20%20%20%20%0A%09%09%09%20%20%20%20curr_row.date%20%3D%20curr_date%3B%0A%09%09%09%20%20%20%20curr_row.info%20%3D%20curr_info%3B%0A%20%20%20%20%09%09%20%20%20%20curr_row.location%20%3D%20curr_location%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20curr_row.venue%20%3D%20curr_venue%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20data.push%28curr_row%29%3B%0A%09%09%09%20%20%20%20curr_row%20%3D%20%7B%7D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%0A%0A%09%7D%29%3B%0A%0A%0A%20%20%20%20return%20data%3B%0A%0A%7D%09%7D%29%3B"
```

## Example module

This scrapes jazz pianist Mark Levine's webpage.

```
define({
    url: "http://marklevine.com/itinerary.html", scraper: function () {
        var data = [];
    
        var curr_month_year = '';
        var curr_month = '';
        var curr_year = '';
        var curr_date = '';
        var curr_info = '';
        var curr_location = '';
        var curr_venue = '';
    
        var curr_row = {};
    
        var itinary_table = $('td[colspan=3]').parents('table');
    
        $('*', itinary_table).each(function(index, elem){
            $elem = $(elem);
    
            if($elem.is('tr')) {
            
                if( $('td[colspan=3]', $elem).length > 0) {
                    curr_month_year = $elem.text();
                    var month_year_array = curr_month_year.split(" ");
                    curr_month = month_year_array[0];
                    curr_year = month_year_array[1];
                } else {
                    curr_date = curr_month + " " + $('td:nth-child(1)', $elem).text() + ", " + curr_year;
                    curr_info = $('td:nth-child(2)', $elem).text();
                    curr_location = $('td:nth-child(3)', $elem).html();
                    curr_venue = $('td:nth-child(3) a', $elem).html();
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

```

