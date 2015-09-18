;(function($) {

  'use strict'

  var UploadImage = function(ed, url) {

    var RESULT, ACTIVE_TAB;
    var UPLOAD_FILE_URL = '/media';
    var FORM_TMPL = (

      '<div>' +

        '<ul class="nav nav-tabs" role="tablist">' +
          '<li role="presentation" class="active">' +
            '<a href="#upload-image-2" data-tab="1" role="tab" data-toggle="tab">Две колонки</a>' +
          '</li>' +
          '<li role="presentation">' +
            '<a href="#upload-image-1" data-tab="2" role="tab" data-toggle="tab">Одна колонка</a>' +
          '</li>' +
         '</ul>' +

        '<div class="tab-content">' +

          '<div role="tabpanel" class="tab-pane active" id="upload-image-2">' +

            '<div class="row images-preview">' +

              '<div class="col-md-6">' +

                '<form action="{url}" accept-charset="UTF-8" method="post">' +
                  '<input name="utf8" type="hidden" value="✓">' +
                  '<input type="hidden" name="authenticity_token" value="{authenticity_token}">' +

                  '<div class="thumbnail fileupload-btn-2-1-dropzone">' +
                    '<div class="image"><span>{size_2_1}</span></div>' +
                  '</div>' +

                  '<input type="file" class="btn btn-primary btn-sm fileupload-btn-2-1" title="{button_name}" name="file">' +
                '</form>' +

              '</div>' +

              '<div class="col-md-6">' +

                '<form action="{url}" accept-charset="UTF-8" method="post">' +
                  '<input name="utf8" type="hidden" value="✓">' +
                  '<input type="hidden" name="authenticity_token" value="{authenticity_token}">' +

                  '<div class="thumbnail fileupload-btn-2-2-dropzone">' +
                    '<div class="image"><span>{size_2_2}</span></div>' +
                  '</div>' +

                  '<input type="file" class="btn btn-primary btn-sm fileupload-btn-2-2" title="{button_name}" name="file">' +
                '</form>' +

              '</div>' +

            '</div>' +

          '</div>' +

          '<div role="tabpanel" class="tab-pane" id="upload-image-1">' +

            '<div class="row images-preview">' +

              '<div class="col-md-12">' +

                '<form action="{url}" accept-charset="UTF-8" method="post">' +
                  '<input name="utf8" type="hidden" value="✓">' +
                  '<input type="hidden" name="authenticity_token" value="{authenticity_token}">' +

                  '<div class="thumbnail fileupload-btn-1-dropzone">' +
                    '<div class="image"><span>{size_1}</span></div>' +
                  '</div>' +

                  '<input type="file" class="btn btn-primary btn-sm fileupload-btn-1" title="{button_name}" name="file">' +
                '</form>' +

              '</div>' +

            '</div>' +

          '</div>' +

        '</div>' +

      '</div>'

    ); // FORM_TMPL

    var TMPL_1_COLUMN = (

      '<div class="row images-box">' +

        '<div class="col-md-12 col-xs-12">' +
          '<img class="img-responsive" src="{url}" alt="img">' +
          '<div class="img-note">{txt}</div>' +
        '</div>' +

      '</div><br />'

    ); // TMPL_1_COLUMN

    var TMPL_2_COLUMNS = (

      '<div class="row images-box">' +

        '<div class="col-md-6 col-xs-6">' +
          '<img class="img-responsive" src="{url_1}" alt="img">' +
        '</div>' +

        '<div class="col-md-6 col-xs-6">' +
          '<img class="img-responsive" src="{url_2}" alt="img">' +
        '</div>' +

      '</div><br />'

    ); // TMPL_2_COLUMNS

    function onInit() {

      RESULT      = {};
      ACTIVE_TAB  = 1;

    }; // onInit

    function Tmpl(format, obj) {

      return format.replace(/{\w+}/g, function(p1, offset, s) {
        return obj[ p1.replace(/[{}]/g, '') ];
      });

    }; // Tmpl

    function showDialog() {

      onInit()

      var win = ed.windowManager.open({

        title:  'Загрузка изображений',
        width:  770,
        height: 370,

        html:  Tmpl(FORM_TMPL, {

          url:                  UPLOAD_FILE_URL,
          authenticity_token:   $('meta[name="csrf-token"]').attr( 'content' ),
          button_name:          'Выберите файл',
          size_2_1:             '375x375',
          size_2_2:             '375x375',
          size_1:               '750x433'

        }),

        buttons: [
          {
            text:    'Вставить',
            onclick: insertImage,
            subtype: 'primary'
          },
          {
            text:     ed.translate('Cancel'),
            onclick:  ed.windowManager.close
          }
        ]

      });

      $(win.$el).find('.mce-reset').removeClass('mce-reset');
      win.classes.remove('container');

      $('input.fileupload-btn-2-1').uploadFileButton({

        imageContainer: $('.fileupload-btn-2-1-dropzone'),
        startCls:   'fileupload-start',
        errorCls:   'fileupload-error',
        dropCls:    'fileupload-drop-over',
        getResult:  function(d) {

          RESULT['2-1'] = d.url;
          return d.url;

        }

      });

      $('input.fileupload-btn-2-2').uploadFileButton({

        imageContainer: $('.fileupload-btn-2-2-dropzone'),
        startCls:   'fileupload-start',
        errorCls:   'fileupload-error',
        dropCls:    'fileupload-drop-over',
        getResult:  function(d) {

          RESULT['2-2'] = d.url;
          return d.url;

        }

      });

      $('input.fileupload-btn-1').uploadFileButton({

        imageContainer: $('.fileupload-btn-1-dropzone'),
        startCls:   'fileupload-start',
        errorCls:   'fileupload-error',
        dropCls:    'fileupload-drop-over',
        getResult:  function(d) {

          RESULT['1'] = d.url;
          return d.url;

        }

      });

      // Выключаем обработку события submit со стороны редактора
      win.off('submit');

      // Запоминаем какая вкладка активна
      $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        ACTIVE_TAB = parseInt($(e.target).data('tab'), 10) || 1;
      });

    } // showDialog

    function insertImage() {

      if (ACTIVE_TAB == 1) {

        if (RESULT['2-1'] && RESULT['2-2']) {

          ed.execCommand('mceInsertContent', false,

            Tmpl(TMPL_2_COLUMNS, {
              url_1: RESULT['2-1'],
              url_2: RESULT['2-2']
            })

          );
          ed.windowManager.close();

        }

      } else {

        if (RESULT['1']) {

          ed.execCommand('mceInsertContent', false,

            Tmpl(TMPL_1_COLUMN, {
              url: RESULT['1'],
              txt: ''
            })

          );
          ed.windowManager.close();

        }

      }

    } // insertImage

    //-------------------------------------------------------------------------
    ed.addButton('mediatusmedia', {
      tooltip:  'Выберите изображение',
      icon:     'image',
      onclick:  showDialog
    });

    ed.addMenuItem('mediatusmedia', {
      text:     'Выберите изображение',
      icon :    'image',
      context:  'insert',
      onclick:  showDialog
    });

  }; // UploadImage

  tinymce.PluginManager.add('mediatusmedia', UploadImage);

})(jQuery);
