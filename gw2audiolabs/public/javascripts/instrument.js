(function ($, document, window, Howl, undefined) {
    
    'use strict';

    // Name the plugin so it's only in one place
    var pluginName = 'instrument';

    // Default options for the plugin as a simple object
    var defaults = {
        path: '/notes/',
        keyToNote: {
            1: '_01_D',
            2: '_02_E',
            3: '_03_F',
            4: '_04_G',
            5: '_05_A',
            6: '_06_B',
            7: '_07_C',
            8: '_08_D'
        },
        currentOctave: 1,
        octaves: ['B', 'G', 'R']
    };

    // Instrument constructor
    function Instrument(element, options) {
        this.element = element;

        this.options = $.extend({}, defaults, options);

        this.$el       = $(element);
        this.$el.data(name, this);

        this._defaults = defaults;

        var meta       = this.$el.data(name + '-opts');
        this.opts      = $.extend(this._defaults, options, meta);
        
        this.opts.fullpath = this.opts.path + this.opts.name + '/';
        
        this.init();
    }

    Instrument.prototype = {
        init: function () {
        },
        
        play: function (key) {
            var sound = this.opts.fullpath + 
                        this.opts.octaves[this.opts.currentOctave] +
                        this.opts.keyToNote[key],
                variant = 4 + this.opts.currentOctave;
                
            if (key == 7 || key == 8) {
                variant++;
            }
            
            //var tune = new Audio(sound + variant + '.mp3');
            //tune.play();
            
            var tune = new Howl({
              urls: [sound + variant + '.mp3']
            }).play();
        },
        
        upOctave: function () {
            if (this.opts.currentOctave < this.opts.octaves.length - 1) {
                this.opts.currentOctave++;
            }
        },
        
        downOctave: function () {
            if (this.opts.currentOctave > 0) {
                this.opts.currentOctave--;
            }
        },
        
        resetOctave: function () {
            this.opts.currentOctave = 1;
        },
        
        octave: function () {
            return this.opts.currentOctave;
        }
    };

    $.fn[pluginName] = function (options) {
        // Iterate through each DOM element and return it
        return this.each(function () {
            // Prevent multiple instantiations
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Instrument(this, options));
            }
        });
    };

    var privateFunction = function () {
    }

}(jQuery, document, window, Howl));