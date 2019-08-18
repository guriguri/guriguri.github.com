/*
 * http://afnmp3.homeip.net:81/~kohyc/calendar/s1221_6.txt 정보를 이용해서 구현
 */
var solarTerm = {
  BASE_DAY : new Date(1996, 2 - 1, 4, 22, 8, 0) // 1996년 2월 4일 22시 8분 00초 입춘
  , YEAR_MINUTE : 525949 // 365일 5시간 49분
  , DAY_MINUTE: 1440
  , solarTerm : ['소한', '대한', '입춘', '우수', '경칩',
                 '춘분', '청명', '곡우', '입하', '소만',
                 '망종', '하지', '소서', '대서', '입추',
                 '처서', '백로', '추분', '한로', '상강',
                 '입동', '소설', '대설', '동지', '소한',
                 '대한']
  , solarTermMinute : [-42456, -21256, 0, 21355, 42843,
                       64498, 86335, 108366, 130578, 152958,
                       175471, 198077, 220728, 243370, 265955,
                       288432, 310767, 332928, 354903, 376685,
                       398290, 419736, 441060, 462295, 483493,
                       504693]
  , getDate : function(orgDate, elapsedMinutes) {
    return new Date(new Date(orgDate).setMinutes(orgDate.getMinutes() + elapsedMinutes));
  }
  , getSolarTerm : function(year) {
    var resultSolarTerm = {};
    var elapsedMinutes = (year - solarTerm.BASE_DAY.getFullYear()) * solarTerm.YEAR_MINUTE;
    var baseDay = solarTerm.getDate(solarTerm.BASE_DAY, elapsedMinutes);
    var date;
    
    for (var i = 0; i < solarTerm.solarTerm.length; i++) {
      date = common.transDateFormat(solarTerm.getDate(baseDay, solarTerm.solarTermMinute[i]), 'yyyy/MM/dd');
      resultSolarTerm[date] = solarTerm.solarTerm[i];
    }
    
    return resultSolarTerm;
  }
};