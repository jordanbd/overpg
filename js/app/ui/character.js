'use strict';

define(['jquery', 'emitter', 'app/ui/templates', 'app/ui/timer', 'app/model/player', 'app/model/words'],

function($, emitter, templates, timer, player, words) {

    var $ele;

    function updateUI() {

        /** Salt **/

        var $saltDescription = $('.salt > .description', $ele);
        $saltDescription.removeClass(function (index, css) {
            return (css.match (/(^|\s)shake\S+/g) || []).join(' ');
        });

        if (player.salt == 100) {
            $saltDescription.addClass('shake-constant');
            $saltDescription.addClass('shake-hard');
        } else if (player.salt > 90) {
            $saltDescription.addClass('shake-constant');
            $saltDescription.addClass('shake');
        } else if (player.salt > 60) {
            $saltDescription.addClass('shake-constant');
            $saltDescription.addClass('shake-little');
        }

        $saltDescription.text(words.salt(player.salt));

        var $saltValue = $('.salt > .value', $ele);
        $saltValue.text(player.salt + '%');

        /** Money **/

        var $moneyDescription = $('.money > .description', $ele);
        var $moneyValue = $('.money > .value', $ele);

        $moneyValue.text('$' + player.money);

        /** Beta chance **/

        var $betaChanceDescription = $('.beta-chance > .description', $ele);
        var $betaChanceValue = $('.beta-chance > .value', $ele);
        $betaChanceValue.text(words.betaChanceValue(player.betaChance));
    }

    function increaseSalt() {
        var incr = 5;
        player.salt += incr;
        emitter.emit('salt-change', incr);
        if (player.salt >= 100) {
            player.salt = 100;
            timer.stop();
            emitter.emit('defeat');
        }
    }

    function showSaltChange(amount) {
        var s = $('<span/>');
        if (amount > 0) {
            s.text("(+" + amount + ")");
        } else {
            s.text("(" + amount + ")");
        }

        s.addClass('fade-queue');
        s.appendTo($('.salt > .increment', $ele));
    }

    function showMoneyChange(amount) {
        var s = $('<span/>');
        if (amount > 0) {
            s.text("(+" + amount + ")");
        } else {
            s.text("(" + amount + ")");
        }

        s.addClass('fade-queue');
        s.appendTo($('.money > .increment', $ele));
    }

    function showBetaChanceChange(amount) {
        var s = $('<span/>');
        s.text(words.betaChanceIncrement(amount));

        s.addClass('fade-queue');
        s.appendTo($('.beta-chance > .increment', $ele));
    }

    function fadeQueuedElements() {
        $('.fade-queue', $ele)
            .removeClass('fade-queue')
            .animate({opacity: 0}, 300, 'linear', function() {
                $(this).remove();
            });
    }

    function setup($parent) {
        $ele = $(templates.getTemplate('characterStatsTmpl')({
            name: 'test',

            moneyValue: '$' + player.money,
            moneyDescription: '',

            saltValue: player.salt,
            saltDescription: words.salt(player.salt),

            betaChanceValue: words.betaChanceValue(player.betaChance),
            betaChanceDescription: ''
        }));
        $parent.append($ele);

        emitter.on('timer-tick5', increaseSalt);

        emitter.on('timer-tick', updateUI);
        emitter.on('timer-tick', fadeQueuedElements); // fades the +salt value on screen

        emitter.on('salt-change', showSaltChange); // prepares the +salt value for the screen
        emitter.on('salt-change', updateUI);

        emitter.on('beta-chance-change', showBetaChanceChange);
        emitter.on('beta-chance-change', updateUI);

        emitter.on('money-change', showMoneyChange);
        emitter.on('money-change', updateUI);

        emitter.on('character-refresh', updateUI);
    }

    return {
        setup: setup
    }

});
