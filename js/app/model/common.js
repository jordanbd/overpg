'use strict';

define([], function() {

    return {
        BETA: {
            VERY_LOW: 0.0025,
            LOW: 0.005,
            MEDIUM: 0.01,
            HIGH: 0.015,
            VERY_HIGH: 0.05
        },

        SALT: {
            WALK_DECREASE: 30,
            ACCOUNT_INCREASE: 5
        },

        TIME: {
            SOCIAL_COST: 10,
            WALK_COST: 10,
            ACCOUNT_COST: 10
        }
    }

});