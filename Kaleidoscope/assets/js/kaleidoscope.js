var app = {
  onLoad: function() {
    $('#submit').unbind('click');
    $('#submit').click(function() {
      if (app.validation() == false) {
        return false;
      }
      
      app.submit();
    });
  }
  , validation: function() {
    var file = $('input[name=file]').fieldValue(); 
    var resizes = $('input[name=resizes]').fieldValue();
    
    if (file[0] == "") {
      app.error("썸네일 생성을 할 이미지 파일을 선택해주세요.");
      return false;
    } 
    
    if (resizes[0] != "") {
      var arr = resizes[0].split(",");
      var len = arr.length;
      
      if (len > 5) {
        app.error("한 번에 생성할 수 있는 썸네일 수는 5 개 까지입니다.");
        return false;
      }
      
      for (var i = 0; i < len; i++) {
        if (! arr[i].match(new RegExp('[0-9]+x?|[0-9]+x[0-9]+|x?[0-9]+'))) {
          app.error("썸네일 사이즈는 가로x높이 형태로 입력해주세요.");
          return false;
        }
      }
    }
  }
  , error: function(msg) {
    var html = '';
    html += '<p style="color: #cd0a0a;">';
    html +=   '<span class="glyphicon glyphicon-alert" style="float: left; margin-right: .3em;"></span>';
    html +=   msg;
    html += '</p>';
    
    $('#dialog .modal-content').removeClass('panel-success').addClass('panel-danger');
    $('#dialog .modal-title').html('Error');
    $('#dialog .modal-body').html(html);
    $('#dialog').modal('show');
  }
  , success: function(json) {
    var html  = '';
    
    html += '<img src="' + json.thumbnails[0] + '" class="img">';
    html += '<div class="urls">';
    
    jQuery.each(json.thumbnails, function() {
      html += '<p class="url">' + this + '</p>';
    });
    
    html += '</div>';
    
    $('#dialog .modal-content').removeClass('panel-danger').addClass('panel-success');
    $('#dialog .modal-title').html('Success');
    $('#dialog .modal-body').html(html);
    $('#dialog').modal('show');
  }
  , submit: function() {
    $('#create_form').ajaxForm({
      dataType : 'text',
      error : function(data) {
        var json = jQuery.parseJSON(data.responseText);
        app.error(json.msg);
      },
      success : function(data) {
        var json = jQuery.parseJSON(data);
        app.success(json);
      }
    });
  }
}	