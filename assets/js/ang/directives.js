'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('raty', function() {
	  return function(scope, element, attrs) {
      element.raty({
        score     : attrs['value']?attrs['value']:0,
        path      : '/demo/images',
        cancel    : true,
        cancelOff : 'cancel-off.png',
        cancelOn  : 'cancel-on.png',
        half      : false,
        size      : 24,
        starHalf  : 'star-half.png',
        starOff   : 'star-off.png',
        starOn    : 'star-on.png'
      });
	  }
	})
  .directive('datepicker', function() {
    return function(scope, element, attrs) {
      element.datepicker({
        format: 'yyyy-mm-dd'
      }); 
    }
  })
  .directive('nicescroll', function() {
    return function(scope, element, attrs) {
      element.niceScroll(
        {
          styler:"fb",
          cursorcolor:"#65cea7", 
          cursorwidth: '6', 
          cursorborderradius: '0px', 
          background: '#424f63', 
          spacebarenabled:false, 
          cursorborder: '0',  
          zindex: '1000'
        }  
      );
    }
  })
  .directive('simplecropper', function() {
    return function(scope, element, attrs) {
      element.simplecropper();
    }
  })
  .directive('searchbox', function() {
    return function(scope, element, attrs) {
        element.ajaxsearchbox({
            serviceUrl: '/searchProjectSuggestions'
            // onSelect: function (suggestion) {
            //     alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
            //     scope.search(suggestion.value);
            // }
        });
    }
  })
  
  .directive('projectsearchbox', ['$compile', 'sharedProperties', function($compile, sharedProperties) {
    return function(scope, element, attrs) {
      console.log('from here',sharedProperties.getProjectAtt());
        element.ajaxsearchbox({
            serviceUrl: '/searchProjectSuggestions?projectId='+sharedProperties.getProjectAtt().id,
            onSelect: function (suggestion) {
                //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
            }
        });
    }
  }])
  .directive('tagit', function() {
    return function(scope, element, attrs) {
      console.log(attrs['source']);
      element.tagit({
          availableTags: scope[attrs['source']]
          ,singleField: true
          ,singleFieldNode: $('#'+attrs['targetitem'])
      });
    }
  })

  .directive('fileupload', function() {
    return function(scope, element, attrs) {
        element.fileupload({
            // This element will accept file drag/drop uploading
          dropZone: element.children('#drop'),
          replaceFileInput: false,

          // This function is called when a file is added to the queue;
          // either via the browse button, or via drag/drop:
          add: function (e, data) {
              var i  = 0;
              var ul = element.children('ul');
              function formatFileSize(bytes) {
                  if (typeof bytes !== 'number') {
                      return '';
                  }

                  if (bytes >= 1000000000) {
                      return (bytes / 1000000000).toFixed(2) + ' GB';
                  }

                  if (bytes >= 1000000) {
                      return (bytes / 1000000).toFixed(2) + ' MB';
                  }

                  return (bytes / 1000).toFixed(2) + ' KB';
              }
              var tpl = $('<li class="working"><input type="text" value="0" data-width="48" data-height="48"'+
                  ' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><p></p><span></span></li>');

              // Append the file name and file size
              tpl.find('p').text(data.files[0].name)
                           .append('<i>' + formatFileSize(data.files[0].size) + '</i>');              
              // Add the HTML to the UL element
              scope.fileuploads.push(data.files[0]);

              data.context = tpl.appendTo(ul);

              // Initialize the knob plugin
              tpl.find('input').knob(data.files[0].name);

              // Listen for clicks on the cancel icon
              tpl.find('span').click(function(){

                  if(tpl.hasClass('working')){

                      jqXHR.abort();
                  }

                  tpl.fadeOut(function(){
                      tpl.remove();
                      console.log("Index is = ", scope.fileuploads.indexOf(data.files[0]), "and File Name is =", data.files[0].name);
                      scope.fileuploads.splice(scope.fileuploads.indexOf(data.files[0]),1);
                  });

              });

              // Automatically upload the file once it is added to the queue
              var jqXHR = data.submit();
          },

          progress: function(e, data){

              // Calculate the completion percentage of the upload
              var progress = parseInt(data.loaded / data.total * 100, 10);

              // Update the hidden input field and trigger a change
              // so that the jQuery knob plugin knows to update the dial
              data.context.find('input').val(progress).change();

              if(progress == 100){
                  data.context.removeClass('working');

                  filename=data.files[0].name;

                  data.context.find("canvas").replaceWith($('<i class="fa '+scope.getIconClass(filename)+' fa-3x">'));

                  filepath=UPLOAD_PATH+"/"+data.files[0].name;
              }
          },

          fail:function(e, data){
              // Something has gone wrong!
              data.context.addClass('error');
          },          
        });
    }
  })
  .directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files);
                });
            });
        }
    };
  }])
  .directive("scrollTo", ["$window", function($window){
    return {
      restrict : "AC",
      compile : function(){

        var document = $window.document;
        
        function scrollInto(idOrName) {//find element with the give id of name and scroll to the first element it finds
          if(!idOrName)
            $window.scrollTo(0, 0);
          //check if an element can be found with id attribute
          var el = document.getElementById(idOrName);
          if(!el) {//check if an element can be found with name attribute if there is no such id
            el = document.getElementsByName(idOrName);

            if(el && el.length)
              el = el[0];
            else
              el = null;
          }

          if(el) //if an element is found, scroll to the element
            el.scrollIntoView();
          //otherwise, ignore
        }

        return function(scope, element, attr) {
          element.bind("click", function(event){
            scrollInto(attr.scrollTo);
          });
        };
      }
    };
  }])
	.directive('scrollToBookmark', function() {
	    return {
	      link: function(scope, element, attrs) {
	        var value = attrs.scrollToBookmark;
	        element.click(function() {
	          scope.$apply(function() {
	            var selector = "[scroll-bookmark='"+ value +"']";
	            var element = $(selector);
	            if(element.length)
	              $('html, body').animate({scrollTop: (element.offset().top)-40}, 1000);  // Don't want the top to be the exact element, -100 will go to the top for a little bit more
	          });
	        });
	      }
	    };
	})
  .directive('dynamic', function ($compile) {
    return {
      restrict: 'A',
      replace: true,
      link: function (scope, ele, attrs) {
        scope.$watch(attrs.dynamic, function(html) {
          ele.html(html);
          $compile(ele.contents())(scope);
        });
      }
    };
  })
  .directive('msdropdown', function() {
    return function(scope, element, attrs) {
      element.msDropdown({
        roundedBorder     : attrs['roundedBorder']?attrs['roundedBorder']:false            
      });
    }
  })
  .directive('wysihtml5', function() {
    return function(scope, element, attrs) {
      element.wysihtml5();
    }
  })
  .directive('dcaccordion', function() {
    return function(scope, element, attrs) {
      element.dcAccordion({
          eventType: 'click',
          autoClose: true,
          saveState: true,
          disableLink: true,
          speed: 'slow',
          showCount: false,
          autoExpand: true,
          classExpand: 'dcjq-current-parent'
      });
    }
  })
  .directive('slimscroll', function() {
    return function(scope, element, attrs) {
      element.slimscroll({
        height: '305px',
        wheelStep: 20
      });
    }
  })
  .directive('niceScroll', function() {
    return function(scope, element, attrs) {
      element.niceScroll({
        cursorcolor: "#1FB5AD",
        cursorborder: "0px solid #fff",
        cursorborderradius: "0px",
        cursorwidth: "3px"
      });
    }
  })
  .directive('tooltip', function() {
    return function(scope, element, attrs) {
      element.tooltip();
    }
  })
  .directive('popover', function() {
    return function(scope, element, attrs) {
      element.popover();
    }
  })
  .directive('easyPieChart', function() {
    return function(scope, element, attrs) {
      element.easyPieChart({
          onStep: function (from, to, percent) {
              $(this.el).find('.percent').text(Math.round(percent));
          },
          barColor: "#39b6ac",
          lineWidth: 3,
          size: 50,
          trackColor: "#efefef",
          scaleColor: "#cccccc"
      });
    }
  })
  .directive('sparkline', function() {
    return function(scope, element, attrs) {
      element.sparkline({
          onStep: function (from, to, percent) {
              $(this.el).find('.percent').text(Math.round(percent));
          },
          barColor: "#39b6ac",
          lineWidth: 3,
          size: 50,
          trackColor: "#efefef",
          scaleColor: "#cccccc"
      });
    }
  })

  ;

