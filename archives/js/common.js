var common = {
  lpadding: function (val, len, padding) {
    var valLen = (val + "").length;
    var s = '';

    for (var i = 0, size = (len - valLen); i < size; i++) {
      s += padding;
    }

    return s + val;
  },
  getStrToDate: function (str, pttn /* yyyyMMdd */ ) {
    var pattern = pttn || /(\d{4})(\d{2})(\d{2})/;
    return new Date(str.replace(pattern, '$1-$2-$3'));
  },
  getQueryMap: function (str) {
    var obj = {};
    if (str.length) {
      str.split("&").forEach(function(v) {
        var t = v.split("=");
        obj[t[0]] = decodeURIComponent(t[1]);
      });
    }
    return obj;
	},
  transDateFormat: function (date, format) {
    /*
     * http://stove99.tistory.com/46 참조
     */
    if (!date.valueOf()) return " ";

    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

    return format.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function ($1) {
      switch ($1) {
      case "yyyy":
        return date.getFullYear();
      case "yy":
        return common.lpadding(date.getFullYear() % 1000, 2, "0");
      case "MM":
        return common.lpadding(date.getMonth() + 1, 2, "0");
      case "dd":
        return common.lpadding(date.getDate(), 2, "0");
      case "E":
        return weekName[date.getDay()];
      case "HH":
        return common.lpadding(date.getHours(), 2, "0");
      case "hh":
        return common.lpadding(((h = date.getHours() % 12) ? h : 12), 2, "0");
      case "mm":
        return common.lpadding(date.getMinutes(), 2, "0");
      case "ss":
        return common.lpadding(date.getSeconds(), 2, "0");
      case "a/p":
        return date.getHours() < 12 ? "오전" : "오후";
      default:
        return $1;
      }
    });
  },
  moveToAnchor: function (anchor, duration) {
    duration = duration || 400;
    event.preventDefault();

    var target_offset = $("#" + anchor).offset();

    try {
      $('html, body').animate({
        scrollTop: target_offset.top
      }, duration);
    } catch (err) {
      console.log(err.message);
    }
  },
  ajax: function (opts) {
    if (opts.url == undefined) {
      console.log(JSON.stringify(message.not_found.ajax_param));
      return;
    }

    opts.type = opts.type || "";
    opts.dataType = opts.dataType || "json";
    opts.async = opts.async || false;

    var successCallback = opts.success;
    var errorCallback = function (request, status, error) {
      console.log(JSON.stringify(message.system.error, status, error));
    };

    opts.success = function (json, textStatus) {
      common.ajaxCallback(json, successCallback, errorCallback);
    };

    $.ajax(opts);
  },
  ajaxCallback: function (json, successCallback, errorCallback) {
    if ((json.exceptionKey != null) && ((json.exceptionKey == "-1") || (son.exceptionKey == "-99"))) {
      console.log(JSON.stringify(json.exceptionValue));
    } else if (successCallback != null) {
      successCallback.call(null, json);
    }
  }
};