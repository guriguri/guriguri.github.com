var app = {
    MAX_EVENT_LENGTH: 15,
    lastDate: '',
    rowIdx: 0,
    rowWidth: '',
    rowHeight: '',
    onLoadEvent: function (product) {
        var year = common.transDateFormat(new Date(), 'yyyy');

        app.init(year);
        app.selectData(product);

        $('.timeline-icon').removeClass('select');

        $('.thumbnail').hover(
            function () {
                var imgUrl = $(this).children('img').attr('src');
                $('#popup img').attr('src', imgUrl);
            },
            function () {
            }
        );

        $('#popup').click(function () {
            $(this).modal('hide');
        });

        if (window.innerWidth <= 360) {
            $('.guide-event-wrap').css({
                'zoom': (window.innerWidth / 360).toFixed(1)
            });
        }

        if (window.innerWidth <= 600) {
            $('a.thumbnail').css({
                'zoom': (window.innerWidth / 600).toFixed(1)
            });
        }
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
                    el += '<li class="timeline-green" id="' + date.replace(/\//g, '') + '">';
                }
                else {
                    el += '<li class="timeline-green hidden" id="' + date.replace(/\//g, '') + '">';
                }

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

        $(".content").append(el);

        if (app.rowWidth == '') {
            app.rowWidth = $('.row').eq(0).innerWidth();
        }
        if (app.rowHeight == '') {
            app.rowHeight = $('.row').eq(0).innerHeight();
        }

        $('.row').eq(app.rowIdx).css('left', app.rowIdx * app.rowWidth + 'px');
    },
    selectData: function (product) {
        common.ajax({
            url: "/data/guide-" + product + ".json",
            type: "GET",
            success: app.callbackSelectData
        });
    },
    callbackSelectData: function (json) {
        var year = common.transDateFormat(new Date(), 'yyyy');
        var now = common.transDateFormat(new Date(), 'yyyyMMdd');

        $(json.list).each(function (idx, itm) {
            var date = year + itm.startDate.replace(/-/g, '');

            // event and tip
            var events = '<div class="guide-event-wrap">';
            var eventLen = 0;
            var tipLen = 0;

            $(itm.events).each(function (idx, itm2) {
                eventLen++;
                events += '<button type="button" class="btn event">';
                events += '<a href="' + itm.href + '" style="text-decoration: none;color: #fff;">' + itm2 + '</a>';
                events += '</button>';
            });

            events += '<div class="clearfix"></div>';

            $(itm.tips).each(function (idx, itm2) {
                tipLen++;
                events += '<button type="button" class="btn tip" style="text-decoration: none;color: #fff;">' + itm2 + '</button>';
            });

            events += '<a data-toggle="modal" data-target="#popup" title="zoom" class="thumbnail">';
            events += '<img src="' + itm.imgUrl + '" style="width:100%; height:100%;">';
            events += '</a>';

            events += '</div>';

            if (events.length > 0) {
                $('#' + date).removeClass('hidden');
                $('#' + date + ' .timeline-body').removeClass('white').html(events);
            }

            if ((app.lastDate == '') || (app.lastDate < date) && (date < now)) {
                app.lastDate = date;
            }

            var timelineDate = $('#' + date + ' .timeline-time > .date').text();
        });
    },
    getDate: function (dateString /* yyyyMMdd */) {
        return new Date(dateString.replace(/(\d{4})(\d{2})(\d{2})/, "$1/$2/$3"));
    },
    getLastDateOfMonth: function (year, month) {
        var now = new Date(year, month, 0);
        return now.getDate();
    }
};