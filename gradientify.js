/**
 * es6-gradientify
 *
 * Provides animating CSS gradients.
 * Ported from jQuery Gradientify.
 * @author  Rahman McGinnis <rahman@kaleandflax.com>
 * @author  Kamil Kuzminski <kamil.kuzminski@codefog.pl> 
 * @see     http://opticalcortex.com/animating-css-gradients/
 */

import _ from 'lodash'

class Gradientify {
    constructor(args) {

        const defaults = {
            angle: '0deg', // Gradient angle
            elements: [],
            fps: 60, // Frames per second            
            gradients: {}, // Gradients
            transition_time: 8, // Transition time            
        }

        this.settings = _.assign({}, defaults, args)

        this.currentIndex = 0
        this.nextIndex = 1
        this.steps_count = 0
        this.steps_total = Math.round(this.settings.transition_time * this.settings.fps);

        this.rgb_steps = {
            start: [0, 0, 0],
            stop: [0, 0, 0],
        };

        this.rgb_values = {
            start: [0, 0, 0],
            stop: [0, 0, 0],
        };

        this.prefixes = ['-webkit-', '-moz-', '-o-', '-ms-', '']

        this.color1 = null
        this.color2 = null
        this.calculateSteps()

        // Launch the timer
        setInterval(function() {
            this.updateGradient.apply(this);
        }.bind(this), Math.round(1000 / this.settings.fps));        
    }

    /**
     * Set next current and next index of gradients array
     *
     * @param {int} num
     *
     * @returns {int}
     */ 
    setNext(num) {
        return (num + 1 < this.settings.gradients.length) ? num + 1 : 0;    
    }

    /**
     * Work out how big each rgb step is
     *
     * @param {int} a
     * @param {int} b
     *
     * @return {int}
     */
    calculateStepSize(a, b) {
        return (a - b) / this.steps_total;
    }

    /**
     * Populate the rgb_values and rgb_steps objects
     */
    calculateSteps() {        
         for (var key in this.rgb_values) {
            if (this.rgb_values.hasOwnProperty(key)) {
                for (var i = 0; i < 3; i++) {
                    this.rgb_values[key][i] = this.settings.gradients[this.currentIndex][key][i];
                    this.rgb_steps[key][i] = this.calculateStepSize(this.settings.gradients[this.nextIndex][key][i], this.rgb_values[key][i]);
                }
            }
        }       
    }

    updateGradient() {
        var i;

        // Update the current RGB values
        for (var key in this.rgb_values) {
            if (this.rgb_values.hasOwnProperty(key)) {
                for (i = 0; i < 3; i++) {
                    this.rgb_values[key][i] += this.rgb_steps[key][i];
                }
            }
        }

        // Generate CSS RGB values
        var t_color1 = 'rgb(' + (this.rgb_values.start[0] | 0) + ',' + (this.rgb_values.start[1] | 0) + ',' + (this.rgb_values.start[2] | 0) + ')'
        var t_color2 = 'rgb(' + (this.rgb_values.stop[0] | 0) + ',' + (this.rgb_values.stop[1] | 0) + ',' + (this.rgb_values.stop[2] | 0) + ')'

        // Has anything changed on this iteration?
        if (t_color1 != this.color1 || t_color2 != this.color2) {

            // Update cols strings
            this.color1 = t_color1
            this.color2 = t_color2

            // Update DOM element style attribute            
            _.each(this.settings.elements, (el) => {
                el.style.backgroundImage = `-webkit-gradient(linear, left bottom, right top, from(${this.color1}), to(${this.color2}))`
                for (let i = 0; i < 4; i++) {
                    el.style.backgroundImage = `${this.prefixes[i]}linear-gradient(${this.settings.angle }, ${this.color1}, ${this.color2})`
                }
            })
            
            

            for (i = 0; i < 4; i++) {
                $(this.elements).css('background-image', this.prefixes[i] + 'linear-gradient(' + this.settings.angle + ', ' + this.color1 + ', ' + this.color2 + ')');
            }
        }

        // We did another step
        this.steps_count++;

        // Did we do too many steps?
        if (this.steps_count > this.steps_total) {
            // Reset steps count
            this.steps_count = 0;

            // Set new indexes
            this.currentIndex = this.setNext(this.currentIndex);
            this.nextIndex = this.setNext(this.nextIndex);

            // Calculate steps
            this.calculateSteps();
        }        
    }
}

export default Gradientify