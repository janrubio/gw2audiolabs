(function ($) {
    
    'use strict';
    
    $(document).ready(function () {
        var $octaveIndicator = $('.octave'),
            octaves = ['low', 'medium', 'high'],
            $buttons = [$('.b1'), $('.b2'), $('.b3'), $('.b4'), $('.b5'), 
                        $('.b6'), $('.b7'), $('.b8'), $('.b9'), $('.b0')],
            $bell = $('.bell')
                        .instrument({ name: 'choirbell' })
                        .data('plugin_instrument'),
            songTimers = [];
                        
        var url = location.href,
            hasHash = url.indexOf("#") > 0,
            hash = url.substring(url.indexOf("#") + 1),
            hashPieces,
            hashNotes;
        
        if (hasHash) {
            hashPieces = hash.split('.');
            hashNotes = decodeURIComponent(hashPieces[2]);
            
            $('.notation').val(hashNotes);
            $('.tempo').val(hashPieces[1]);
            
            if (hashPieces[3] === 'autoplay') {
                $('.autoplay').prop('checked', true);
                setTimeout(function() {
                    stopSong(songTimers);
                    songTimers = playSong(hashNotes);
                }, 1500);
            }
            
            generatePermalink();
        }
        
        $('.autoplay').on('change', function () {
            generatePermalink();
        });
        
        $('.tempo').on('keyup', function() {
            generatePermalink();
        });
        
        $('.notation').on('keyup', function () {
            generatePermalink();
        });
        
        $('.permalink').on('click', function () {
            this.focus();
            this.select();
        });
        
        $('.help').on('click', function () {
            $('.moreHelp').toggle();
        });
        
        $('body').on('keypress', function (e) {
            var code = e.which,
                pressed = code - 48,
                octave = 0;
            
            if (code > 48 && code < 57) {
                $bell.play(pressed);
                $buttons[pressed - 1].addClass('active');
            } else if (code == 57) {
                $bell.downOctave();
                $buttons[8].addClass('active');
            } else if (code == 48) {
                $bell.upOctave();
                $buttons[9].addClass('active');
            }
            
            if (code == 57 || code == 48) {
                octave = $bell.octave();
                handleOctave(octave, $buttons[8], $buttons[9]);
                handleOctaveIndicator(octaves[octave], $octaveIndicator);
            }
        });
        
        $('body').on('keyup', function () {
            $.each($buttons, function (index, $button) {
                $button.removeClass('active');
            }); 
        });
        
        $('.instrument').on('click', function () {
            $('.picker').toggleClass('picked');
            $('.instruments').toggle();
        });
        
        $('.choirbell').on('click', function () {
            $('.picker').toggleClass('picked');
            $('.instruments').toggle();
        });
        
        $('.b1').on('click', function () { $bell.play(1); });
        $('.b2').on('click', function () { $bell.play(2); });
        $('.b3').on('click', function () { $bell.play(3); });
        $('.b4').on('click', function () { $bell.play(4); });
        $('.b5').on('click', function () { $bell.play(5); });
        $('.b6').on('click', function () { $bell.play(6); });
        $('.b7').on('click', function () { $bell.play(7); });
        $('.b8').on('click', function () { $bell.play(8); });
        
        $('.b9').on('click', function () { $bell.downOctave(); handleOctaveIndicator(octaves[$bell.octave()], $octaveIndicator); handleOctave($bell.octave(), $buttons[8], $buttons[9]); });
        $('.b0').on('click', function () { $bell.upOctave();handleOctaveIndicator(octaves[$bell.octave()], $octaveIndicator); handleOctave($bell.octave(), $buttons[8], $buttons[9]); });
    
        $('.song').on('click', function () {
            var $notesIndicator = $('.notation'),
                notes = $(this).data('notes');
            $notesIndicator.val(notes);

            if ($bell.octave() == 0) {
                $bell.upOctave(); 
            } else if ($bell.octave() == 2) {
                $bell.downOctave();
            }
            handleOctaveIndicator(octaves[$bell.octave()], $octaveIndicator); 
            handleOctave($bell.octave(), $buttons[8], $buttons[9]);
            stopSong(songTimers);
            songTimers = playSong(notes);
            generatePermalink();
        });
        
        $('.instructions .play').on('click', function() {
            var notes = $.trim($('.notation').val());
            
            if ($bell.octave() == 0) {
                $bell.upOctave(); 
            } else if ($bell.octave() == 2) {
                $bell.downOctave();
            }
            handleOctaveIndicator(octaves[$bell.octave()], $octaveIndicator); 
            handleOctave($bell.octave(), $buttons[8], $buttons[9]);
            stopSong(songTimers);
            songTimers = playSong(notes);
        });
    });
    
    function simulateKeyPress(key) {
        var $body = $('body'),
            press = $.Event('keypress');
        press.ctrlKey = false;
        press.which = key.charCodeAt(0);
        $body.trigger(press);
        setTimeout(function () { $body.trigger($.Event('keyup')); }, 150);
    }
    
    function handleOctave(octave, $up, $down) {
        if (octave === 0) {
            $up.addClass('off');
        } else if (octave === 2) {
            $down.addClass('off');
        } else {
            $down.removeClass('off');
            $up.removeClass('off');
        }        
    }
    
    function handleOctaveIndicator(octave, $indicator) {
        $indicator
            .removeClass('high')
            .removeClass('medium')
            .removeClass('low');
        $indicator.addClass(octave);
    }
    
    function playSong(notes) {
        var songKeys = notes.split(''),
            tempo = +$('.tempo').val(),
            delay = 0,
            songTimers = [];
        
        $.each(songKeys, function (index, key) {
            var baseSpeed = tempo,
                swapSpeed = 180;
            
            if (key === ' ') {
                delay += baseSpeed;
            } else if (key === '(' || key === ']') {
                songTimers.push(setTimeout(function () {
                    simulateKeyPress('0');
                }, delay));
                delay += swapSpeed;
            } else if (key === ')' || key === '[') {
                songTimers.push(setTimeout(function () {
                    simulateKeyPress('9');
                }, delay));
                delay += swapSpeed;
            } else {
                songTimers.push(setTimeout(function () {
                    simulateKeyPress(key);
                }, delay));
                delay += baseSpeed;
            }
        });
        
        return songTimers;
    }
    
    function stopSong(songTimers) {
        var i;
        if (songTimers !== undefined) {
        for (i = 0; i < songTimers.length; i++) {
                if (songTimers[i] !== undefined) {
                    clearTimeout(songTimers[i]);
                }
            }
        }
    }
    
    function generatePermalink() {
        var $permalink = $('.permalink'),
            tempo = $('.tempo').val(),
            isAutoPlay = $('.autoplay').prop('checked'),
            notes = $('.notation').val(),
            pathArray = window.location.href.split( '/' ),
            protocol = pathArray[0],
            host = pathArray[2],
            url = protocol + '//' + host,
            hash = 'bell.' + tempo +  '.' + notes,
            permalink = url + '#';
        
        if (isAutoPlay) {
            hash += '.autoplay';
        } else {
            hash += '.noplay';
        }
        
        $permalink.val(permalink + encodeURIComponent(hash));
    }
    
}(jQuery));
