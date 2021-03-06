'use strict';

define(['emitter', 'jquery'], function(emitter, $) {

    return {
        data: {
            events: {}
        },
        name: 'test',
        history: [],
        characterClassId: null,
        achievements: [],
        hasAchievement: function(code) {
            return $.inArray(code, this.achievements) >= 0;
        },
        items: [],
        newItems: [],
        removeItem: function(code) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i] == code) {
                    this.items.splice(i, 1);
                    emitter.emit('item-change');
                    break;
                }
            }
        },
        countItems: function(code) {
            var count = 0;
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i] == code) {
                    count++;
                }
            }
            return count;
        },
        addItem: function(code) {
            this.items.push(code);
            this.newItems.push(code);
            emitter.emit('item-change');
        },
        quests: [],
        questHistory: [],
        hasQuest: function(code) {
            for (var i = 0; i < this.quests.length; i++) {
                if (this.quests[i] == code) {
                    return true;
                }
            }
            return false;
        },
        removeQuest: function(code) {
            for (var i = 0; i < this.quests.length; i++) {
                if (this.quests[i] == code) {
                    this.quests.splice(i, 1);
                    this.questHistory.push(code);
                    emitter.emit('quest-change');
                    break;
                }
            }
        },
        addQuest: function(code) {
            this.quests.push(code);
            emitter.emit('quest-change');
        },
        salt: 0,
        changeSalt: function(amt) {
            this.salt += amt;
            if (this.salt < 0) {
                this.salt = 0;
            }
            emitter.emit('salt-change', amt);
        },
        secondsRemaining: 240,
        changeSecondsRemaining: function(amt, noSaltChange) {
            if (amt == 0) {
                return;
            }

            var sign = amt?amt<0?-1:1:0;

            for (var t = 0; t < Math.abs(amt); t++) {
                this.secondsRemaining += sign;
                if (sign < 0) {
                    emitter.emit('player-timer-tick', noSaltChange);
                    if (this.secondsRemaining % 30 == 0) {
                        emitter.emit('player-timer-tick30', noSaltChange);
                    }
                    if (this.secondsRemaining % 10 == 0) {
                        emitter.emit('player-timer-tick10', noSaltChange);
                    }
                    if (this.secondsRemaining % 5 == 0) {
                        emitter.emit('player-timer-tick5', noSaltChange);
                    }
                }
            }
            if (this.secondsRemaining < 0) {
                this.secondsRemaining = 0;
            }

            if (amt < 0) {
                this.changeSecondsElapsed(Math.abs(amt));
            }
        },
        // A second hidden clock for events I dont want to be affected by movements in time
        secondsElapsed: 0,
        changeSecondsElapsed: function(amt) {
            for (var t = 0; t < amt; t++) {
                this.secondsElapsed++;
                if (this.secondsElapsed % 30 == 0) {
                    emitter.emit('global-timer-tick30');
                }
                if (this.secondsElapsed % 10 == 0) {
                    emitter.emit('global-timer-tick10');
                }
            }
        },
        money: 40,
        changeMoney: function(amt) {
            this.money += amt;
            emitter.emit('money-change', amt);
        },
        betaChance: 0,
        changeBetaChance: function(amt) {
            this.betaChance += amt;
            if (this.betaChance < 0) {
                this.betaChance = 0;
            }
            emitter.emit('beta-chance-change', amt);
        }
    };

});