(function () {
  angular.module('widgetGrid').controller('wgWidgetController', function($scope, $compile) {    
    this.innerCompile = function (element) {
      $compile(element)($scope);
    };
  });


  angular.module('widgetGrid').directive('wgWidget', function (Widget) {
    return {
      scope: {
        position: '=',
        editable: '@?'
      },
      restrict: 'AE',
      controller: 'wgWidgetController',
      require: '^wgGrid',
      transclude: true,
      templateUrl: 'wg-widget',
      replace: true,
      link: function (scope, element, attrs, gridCtrl) {
        var widgetOptions = scope.position;
        var widget = new Widget(widgetOptions);

        scope.editable = 'false';
        scope.widget = widget;

        scope.getNodeIndex = getNodeIndex;
        scope.setWidgetPosition = setWidgetPosition;

        scope.$on('wg-update-rendering', updateView);
        scope.$on('$destroy', function () {
          gridCtrl.removeWidget(widget);
        });

        gridCtrl.addWidget(widget);

        function getNodeIndex() {
          var index = 0, elem = element[0];
          while ((elem = elem.previousElementSibling) !== null) { ++index; }
          return index;
        }


        function setWidgetPosition(position) {
          var oldPosition = widget.getPosition();
          widget.setPosition(position);
          var newPosition = widget.getPosition();
          
          if (!angular.equals(oldPosition, newPosition)) {
            gridCtrl.updateWidget(widget);
          }
          updateView();
        }


        function updateView() {
          element.css(gridCtrl.getWidgetStyle(widget));
          scope.position = scope.position || {};
          angular.extend(scope.position, widget.getPosition());
        }
      }
    };
  });
})();
