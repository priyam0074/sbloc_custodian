'use strict';

(function() {

    var loanlistingController = function(loanService, EntityMapper, Loan, LoanSecurity, userService, $router) {

        var $ctrl = this;

        var user = userService.getLoggedInUser();
        $ctrl.currentUserRole = user && (user.roles instanceof Array) && user.roles[0].role;

        loanService.getLoanList({ usedId: user.id, userRole: user.roles[0].role }).then(function(response) {

            $ctrl.loanList = new EntityMapper(Loan).toEntities(response.data.loanList);

        }, function() {});

        loanService.readSecurities().then(function(response){
            $ctrl.securitiesList = new EntityMapper(LoanSecurity).toEntities(response.data.securitiesList);
        }, function() {});

        $ctrl.navigateToLoanDetails = function(loanId) {
            $router.navigate(['LoadLoanDetails', { id: loanId }]);
        };


        $ctrl.updateSecurityPrice = function(){
            loanService.updateSecurityPrice($ctrl.securitiesList);
            /* $ctrl.showSecurityMessage = false;
            loanService.updateSecurityPrice($ctrl.securitiesList).then(function(response){
                    if(response && response.data){
                            $ctrl.securityUpdateMessage = response.data.message
                            if(response.data.success){
                                $ctrl.showSecurityMessage = true;
                            }
                    }
            });*/
        };
    };

    loanlistingController.$inject = ['loanService', 'EntityMapper', 'Loan', 'LoanSecurity', 'userService', '$router'];


    var componentConfig = {
        // isolated scope binding
        bindings: {
            loanInfo: '<'
        },
        templateUrl: 'loanlisting/loanlisting.html',
        controller: loanlistingController,
        $canActivate: [
            '$nextInstruction',
            '$prevInstruction',
            'userService',
            '$router',
            function($nextInstruction, $prevInstruction, userService,
                $router) {
                if (userService.isAnonymous() === true) {
                    $router.navigate(['Login']);
                    return false;
                } else {
                    return true;
                }
            }
        ]
    };

    module.exports = angular.module('loanlisting')
        .component('loanListing', componentConfig);

})();
