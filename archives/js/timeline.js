  var app = {
    MAX_EVENT_LENGTH: 15,
    ADJUST_DATE: 2,
    lastYear: '',
    lastDate: '',
    rowIdx: 0,
    rowWidth: '',
    rowHeight: '',
    onLoadEvent: function () {
      app.setConstant(window.innerWidth);

      $(window).resize(function () {
        app.setConstant($(this).width());
        app.adjustEventShowHide();
      });

      var currYear = common.transDateFormat(new Date(), 'yyyy');

      for (var year = currYear; year >= 2012; year--) {
        if (app.lastYear == '') {
          app.lastYear = year;
        }

        app.init(year);
        app.selectData(year);
        app.selectTempRehData(year);
      }

      app.setNavTimeline(app.lastDate);

      $('.navbar-static .glyphicon-star').parent().click(function () {
        var dStr = $(this).attr('goDate');

        if ((typeof dStr != "undefined") && (dStr != "")) {
          var d = app.getDate(dStr.substr(0, 8));

          var top = new Date(d.setDate(d.getDate() - app.ADJUST_DATE));
          var topDate = common.transDateFormat(top, 'yyyyMMdd');

          common.moveToAnchor(topDate, 800);
          app.setNavTimeline(dStr);

          location.hash = dStr;
        }

        return false;
      });

      $('.navbar-static .glyphicon-arrow-right').parent().click(function () {
        var dStr = $(this).attr('goDate');

        if ((typeof dStr != "undefined") && (dStr != "")) {
          var d = app.getDate(dStr.substr(0, 8));

          var top = new Date(d.setDate(d.getDate() - app.ADJUST_DATE));
          var topDate = common.transDateFormat(top, 'yyyyMMdd');

          common.moveToAnchor(topDate, 800);
          app.setNavTimeline(dStr);

          location.hash = dStr;
        }

        return false;
      });

      $('.navbar-static .glyphicon-arrow-left').parent().click(function () {
        var dStr = $(this).attr('goDate');

        if ((typeof dStr != "undefined") && (dStr != "")) {
          var d = app.getDate(dStr.substr(0, 8));

          var top = new Date(d.setDate(d.getDate() - app.ADJUST_DATE));
          var topDate = common.transDateFormat(top, 'yyyyMMdd');

          common.moveToAnchor(topDate, 800);
          app.setNavTimeline(dStr);

          location.hash = dStr;
        }

        return false;
      });

      // event
      $('.event-show').bind('click', function () {
        var eventWrapHeight = $(this).parent().parent().height();

        if (eventWrapHeight < 44) {
          eventWrapHeight = 44;
        }

        $(this).parent().parent().attr('style', 'height: 100%');
        $(this).parent().attr('style', 'height: 100%');
        $(this).parent().children('.event-ellipsis, .event-hide').removeClass('hidden');
        $(this).parent().children('.event-show').addClass('hidden');
      });

      $('.event-hide').bind('click', function () {
        if ($(this).parent().parent().children('.tag-wrap').attr('style') == undefined) {
        	$(this).parent().parent().removeAttr('style');
        }
        
        $(this).parent().removeAttr('style');
        $(this).parent().children('.event-ellipsis, .event-hide').addClass('hidden');
        $(this).parent().children('.event-show').removeClass('hidden');
      });
    },
    setConstant: function (width) {
      if (width <= 460) {
        app.MAX_EVENT_LENGTH = 70;
        app.ADJUST_DATE = 1;
      } else {
        app.MAX_EVENT_LENGTH = 15;
        app.ADJUST_DATE = 2;
      }
    },
    adjustEventShowHide: function () {
      $('.event-wrap').each(function (idx, itm) {
        var eventWrap = $(this);
        var eventLen = eventWrap.children('.event-show').attr('eventLen');

        if (eventLen > app.MAX_EVENT_LENGTH) {
          eventLen = 0;

          eventWrap.children('.event').each(function (idx, itm) {
            eventLen += itm.textContent.length;

            if (eventLen > app.MAX_EVENT_LENGTH) {
              $(this).addClass('event-ellipsis hidden');
            } else {
              $(this).removeClass('event-ellipsis hidden');
            }
          });

          $(this).children('.event-show').removeClass('hidden');
        }
      });
    },
    init: function (year) {
      var el = '<div class="row">';
      el += '<ul class="timeline">';

      var solarTermMap = solarTerm.getSolarTerm(year);

      for (var month = 1; month < 13; month++) {
        var lastDateOfMonth = app.getLastDateOfMonth(year, month);

        for (var day = 1; day <= lastDateOfMonth; day++) {
          var date = year + '/' + common.lpadding(month, 2, '0') + '/' + common.lpadding(day, 2, '0');
          var solar_term = '';
          var week = new Date(year, month - 1, day);

          if (solarTermMap[date] !== undefined) {
            solar_term = solarTermMap[date];
          }

          el += '<li class="timeline-green" id="' + date.replace(/\//g, '') + '">';
          el += '<div class="timeline-time">';

          if (week.getDay() == 0) {
            el += '<span class="date sunday">' + date + '</span>';
          } else {
            el += '<span class="date">' + date + '</span>';
          }

          el += '<span class="temperature"></span>';
          el += '<span class="humidity"></span>';
          el += '<span class="solar-term">' + solar_term + '</span>';
          el += '</div>';
          el += '<div class="timeline-icon"></div>';
          el += '<div class="timeline-body white">';
          el += '</div>';
          el += '</li>';
        }
      }

      el += '</ul>';
      el += '</div>';

      if (app.rowIdx == 0) {
        el += '<div class="oldRowWrap"></div>';

        $(".content").append(el);
      } else {
        $(".oldRowWrap").append(el);
      }

      if (app.rowWidth == '') {
        app.rowWidth = $('.row').eq(0).innerWidth();
      }
      if (app.rowHeight == '') {
        app.rowHeight = $('.row').eq(0).innerHeight();
        $('.oldRowWrap').css('height', app.rowHeight);
        //          $('.oldRowWrap').css('max-width', app.rowWidth + 'px');
      }

      if (app.rowIdx == 0) {
        $('.row').eq(app.rowIdx).css('left', app.rowIdx * app.rowWidth + 'px');
        $('.oldRowWrap').eq(app.rowIdx).css('left', (app.rowIdx + 1) * app.rowWidth + 'px');
      } else {
        $('.row').eq(app.rowIdx).css('left', (app.rowIdx - 1) * app.rowWidth + 'px');
      }

      app.rowIdx++;
    },
    selectData: function (year) {
      common.ajax({
        url: "/data/blog-list-" + year + ".json",
        type: "GET",
        success: app.callbackSelectData
      });
    },
    callbackSelectData: function (json) {
      var prevDate = '';
      var year = '';

      $(json.list).each(function (idx, itm) {
        var date = itm.startDate.replace(/-/g, '').substr(0, 8);

        // event
        var events = '<div class="event-wrap">';
        var eventLen = 0;

        $(itm.events).each(function (idx, itm2) {
          eventLen += itm.length;
          events += '<button type="button" class="btn event">';
          events +=  '<a href="' + itm.href + '" style="text-decoration: none;color: #fff;">' + itm2 + '</a>';
          events += '</button>';
        });

        events += '<button type="button" class="btn event event-show hidden" eventLen="' + eventLen + '">show</button>';
        events += '<button type="button" class="btn event event-hide hidden">hide</button>';
        events += '</div>';

        if (eventLen != 0) {
          $('#' + date + ' .timeline-body').removeClass('white').html(events);

          if (prevDate != '') {
            $('#' + date + ' .timeline-body a').attr('prevDate', prevDate);
            $('#' + prevDate + ' .timeline-body a').attr('nextDate', date);
          }

          year = date.substr(0, 4);
          prevDate = date;

          if (app.lastDate < date) {
            app.lastDate = date;
          }
        }
        
				var timelineDate = $('#' + date + ' .timeline-time > .date').text();
				$('#' + date + ' .timeline-time > .date').html('<a href="' + itm.href + '" class="nav-link" title="' + itm.title + '">' + timelineDate + '</a>');
      });

      app.adjustEventShowHide();
    },
    selectTempRehData: function (year) {
      common.ajax({
        url: "https://raw.githubusercontent.com/guriguri/gunpo-temp-reh/master/data/temp-reh-list-" + year + ".json",
        type: "GET",
        success: app.callbackSelectTempRehData
      });
    },
    callbackSelectTempRehData: function (json) {
      $(json.list).each(function (idx, itm) {
        var date = itm.date.replace(/-/g, '');
        $('#' + date + ' .temperature').html(Math.round(itm.avgTemp) + "°C");
        $('#' + date + ' .humidity').html(Math.round(itm.avgReh) + "%RH");
      });
    },
    setNavTimeline: function (date) {
      $('.navbar-static .glyphicon-star').parent().attr('goDate', app.lastDate);

      dStr = $('#' + date + ' .timeline-body a').attr('nextDate');
      $('.navbar-static .glyphicon-arrow-right').parent().attr('goDate', '');
      if ((typeof dStr != "undefined") && (dStr != "")) {
        $('.navbar-static .glyphicon-arrow-right').parent().attr('goDate', dStr);
      }

      dStr = $('#' + date + ' .timeline-body a').attr('prevDate');
      $('.navbar-static .glyphicon-arrow-left').parent().attr('goDate', '');
      if ((typeof dStr != "undefined") && (dStr != "")) {
        $('.navbar-static .glyphicon-arrow-left').parent().attr('goDate', dStr);
      }
      
      $('.timeline-icon').removeClass('select');
      $('#' + date + ' .timeline-icon').addClass('select');
    },
    getDate: function (dateString /* yyyyMMdd */ ) {
      return new Date(dateString.replace(/(\d{4})(\d{2})(\d{2})/, "$1/$2/$3"));
    },
    getLastDateOfMonth: function (year, month) {
      var now = new Date(year, month, 0);
      return now.getDate();
    }
  };