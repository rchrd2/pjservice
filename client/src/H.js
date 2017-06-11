/**
 * Injected into client.
 * Helper functions.
 */

var H = {
  /**
   * @param Elemnent (not a jquery element)
   */
  getInnerText: function(el) {
    var sel, range, innerText = "";
    if (typeof document.selection != "undefined" && typeof document.body.createTextRange != "undefined") {
      range = document.body.createTextRange();
      range.moveToElementText(el);
      innerText = range.text;
    } else if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
      sel = window.getSelection();
      sel.selectAllChildren(el);
      innerText = "" + sel;
      sel.removeAllRanges();
    }
    return innerText;
  },

  qualifyURL: function(url) {
    var a = document.createElement('a'); a.href = url; return a.href;
  },

  getURLSync: function(url) {
    return $.ajax({ type: "GET", url: url, cache: true, async: false }).responseText;
  },

  extractUrlValue: function(key, url) {
    var match = url.match('[?&]' + key + '=([^&]+)');
    return match ? match[1] : null;
  },
};
