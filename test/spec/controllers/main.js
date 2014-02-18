'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('currencyExchangeApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of currency options to the scope', function () {
    expect(scope.currencyOptions.length).toBe(9);
  });
});
