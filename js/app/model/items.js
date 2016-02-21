'use strict';

define(['app/model/player', 'app/model/words'], function(player, words) {

    // TODO: Salty pants - increases your salt generation but every N seconds increase your beta chance

    var items = {
        'stale-water': {
            title: 'Stale water',
            description: 'Greatly lowers your saltiness. Tastes awful though.',
            outcomes: [
                {
                    chance: 0.7,
                    flavourText: 'You slam down what you assume is water.',
                    apply: function() {
                        player.changeSalt(-30);
                        player.removeItem('stale-water');
                        return words.buildApplyReturn({salt: -30, itemCount: -1});
                    },
                    buttons: [
                        {
                            text: 'That wasn\'t water'
                        }
                    ]
                },
                {
                    chance: 0.3,
                    flavourText: 'You forget you have a tiny bladder and have to rush to the bathroom.',
                    apply: function() {
                        player.changeSecondsRemaining(-30);
                        player.removeItem('stale-water');
                        return words.buildApplyReturn({time: -30, itemCount: -1});
                    },
                    buttons: [
                        {
                            text: 'Maybe that wasn\'t actually water?'
                        }
                    ]
                }
            ]
        },
        'clover': {
            title: 'Seven-leaf clover',
            description: 'Greatly increases your chances of getting into the beta.',
            outcomes: [
                {
                    chance: 1,
                    flavourText: 'You eat the clover to gain its power.',
                    apply: function() {
                        player.changeBetaChance(0.1);
                        player.removeItem('clover');
                        return words.buildApplyReturn({beta: 0.1, itemCount: -1});
                    },
                    buttons: [
                        {
                            text: 'You didn\'t have to eat it'
                        }
                    ]
                }
            ]
        },
        'origins': {
            title: 'Overwatch: Origins edition',
            description: 'You have prepurchased Overwatch. This item literally does nothing. It certainly doesn\'t guarantee Beta access, right Blizzard? :(',
            outcomes: [
                {
                    chance: 1,
                    flavourText: 'RED! This isn\'t the time to use that!',
                    apply: function() {},
                    buttons: [
                        {
                            text: 'Yes Lord Helix'
                        }
                    ]
                }
            ]
        },
        'berry': {
            title: 'A berry',
            description: 'Probably safe to eat.',
            outcomes: [
                {
                    chance: 0.66,
                    flavourText: 'Ew, it\'s all salty.',
                    apply: function() {
                        player.changeSalt(5);
                        player.removeItem('berry');
                        return words.buildApplyReturn({salt: 5, itemCount: -1});
                    },
                    buttons: [
                        {
                            text: 'Why did it have salt in it?'
                        }
                    ]
                },
                {
                    chance: 0.32,
                    flavourText: 'Oh lucky, it wasn\'t one of the poisonous berries.',
                    apply: function() {
                        player.changeSalt(-5);
                        player.removeItem('berry');
                        return words.buildApplyReturn({salt: -5, itemCount: -1});
                    },
                    buttons: [
                        {
                            text: 'I should eat another one.'
                        }
                    ]
                },
                {
                    chance: 0.01,
                    flavourText: 'This is a poisonous berry.',
                    apply: function() {
                        player.data['beta'] = true; // HACK
                        player.data['deadberry'] = true;
                        player.removeItem('berry');
                        return 'You have died.';
                    },
                    buttons: [
                        {
                            text: 'Wait, seriously?'
                        }
                    ]
                }
            ]
        },
        'mineral-water': {
            title: 'Mineral water',
            description: 'Lowers your saltiness. At least I think it does. Is salt a mineral? Does mineral water... contain salt? Oh god...',
            outcomes: [
                {
                    chance: 1,
                    flavourText: 'Salt is a mineral but let\'s just say this water does not have any.',
                    apply: function() {
                        player.changeSalt(-20);
                        player.removeItem('mineral-water');
                        return words.buildApplyReturn({salt: -20, itemCount: -1});
                    }
                }
            ]
        },
        'beard': {
            title: 'Beard of Jeff Kaplan',
            description: 'Return the beard. Complete the circle. Release me from this prison!',
            outcomes: [
                {
                    chance: 1,
                    flavourText: 'NOW WE ARE ONE.',
                    apply: function() {
                        player.removeItem('beard');
                        player.data['isjkapp'] = true;
                        player.data['beta'] = true;
                    },
                    buttons: [
                        {
                            text: 'HA HA HA'
                        }
                    ]
                }
            ]
        },
        'briefcase': {
            title: 'A mysterious briefcase',
            description: 'It is very mysterious. Also who even uses briefcases these days?',
            outcomes: [
                {
                    chance: 1,
                    flavourText: 'Oh wow there is $5,000 in this thing!',
                    apply: function() {
                        player.changeMoney(5000);
                        player.removeItem('briefcase');
                        return words.buildApplyReturn({money: 5000, itemCount: -1});
                    },
                    buttons: [
                        {
                            text: 'I should probably keep the money'
                        }
                    ]
                }
            ]
        },
        'puppet': {
            title: 'Ginger puppet',
            description: 'You could start a Youtube series with this puppet.',
            outcomes: [
                {
                    chance: 1,
                    flavourText: 'You have endeared yourself to the Overwatch CMs.',
                    apply: function() {
                        player.removeItem('puppet');
                        player.changeBetaChance(0.05);
                        return words.buildApplyReturn({beta: 0.05, itemCount: -1});
                    },
                    buttons: [
                        {
                            text: 'On Solace is actually pretty funny.'
                        }
                    ]
                }
            ]
        },
        'accelerator': {
            title: 'Miniature chronal accelerator',
            description: 'Gives you an additional 60 seconds of time. One-time use only.',
            outcomes: [
                {
                    chance: 1,
                    flavourText: 'Let\'s try that again!',
                    apply: function() {
                        player.removeItem('accelerator');
                        player.changeSecondsRemaining(60);
                        return words.buildApplyReturn({time: 60, itemCount: -1});
                    },
                    buttons: [
                        {
                            text: 'Whee!'
                        }
                    ]
                }
            ]
        },
        'visor': {
            title: 'Tactical visor',
            description: 'If you were a soldier it would help you lock on to targets. In your case it helps you lock on to ' +
                'the Beta (???). I am not a good game designer.',
            outcomes: [
                {
                    chance: 1,
                    flavourText: 'You\'ve got the beta in your sights!',
                    apply: function() {
                        player.removeItem('visor');
                        player.changeBetaChance(0.05);
                        return words.buildApplyReturn({beta: 0.05, itemCount: -1});
                    },
                    buttons: [
                        {
                            text: 'I am a soldier now'
                        }
                    ]
                }
            ]
        },
        'peanut': {
            title: 'Peanut butter',
            description: 'Lower\'s your salt and makes gorillas happy.',
            outcomes: [
                {
                    chance: 1,
                    flavourText: 'Did someone say peanut butter?',
                    apply: function() {
                        player.removeItem('peanut');
                        player.changeSalt(-25);
                        return words.buildApplyReturn({salt: -25, itemCount: -1});
                    }
                }
            ]
        },
        'deadbook': {
            title: 'Book of the dead',
            description: 'Probably just some gag gift.',
            outcomes: [
                {
                    chance: 1,
                    flavourText: 'You hear voices as you open the dusty tome. The darkness has found you.',
                    apply: function() {
                        player.data['darkness'] = 0;
                        player.removeItem('deadbook');
                        return words.buildApplyReturn({itemCount: -1}) + 'New items for sale at shop.'
                    },
                    buttons: [
                        {
                            text: 'This is fine'
                        }
                    ]
                }
            ]
        }

        // TODO: book of dead items (all increase darkness)

        // TODO: ward off slender

        // TODO home security system
    };

    return {
        get: items
    }
});