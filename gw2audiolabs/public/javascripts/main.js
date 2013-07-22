(function ($) {
    
    'use strict';
    
    $(document).ready(function () {
        var $octaveIndicator = $('.octave'),
            octaves = ['low', 'medium', 'high'],
            $buttons = [$('.b1'), $('.b2'), $('.b3'), $('.b4'), $('.b5'), 
                        $('.b6'), $('.b7'), $('.b8'), $('.b9'), $('.b0')],
            $bell = $('.bell')
                        .instrument({ name: 'choirbell' })
                        .data('plugin_instrument');
        
        $('body').on('keypress', function (e) {
            console.warn('test');
            
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
    });
    
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
    
}(jQuery));
