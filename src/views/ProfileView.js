/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2015
 */
define(function(require, exports, module) {

    // import dependencies
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var BkImageSurface = require('famous-bkimagesurface/BkImageSurface');
    var ScrollController = require('famous-flex/ScrollController');
    var TextView = require('./TextView');

    /**
     * @class
     * @param {Object} options Configurable options.
     * @param {Object} options.factory Factory delegate for creating new renderables.
     * @alias module:ProfileView
     */
    function ProfileView(options) {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createRenderables.call(this);
        _setupListeners.call(this);
    }
    ProfileView.prototype = Object.create(View.prototype);
    ProfileView.prototype.constructor = ProfileView;

    ProfileView.DEFAULT_OPTIONS = {
        classes: ['view', 'profile'],
        imageSize: [200, 200],
        imageScale: [1, 1, 1],
        nameHeight: 60,
        profileText: 'Scarlett Johansson was born in New York City. Her mother, Melanie Sloan, is from an Ashkenazi Jewish family, and her father, Karsten Johansson, is Danish. Scarlett showed a passion for acting at a young age and starred in many plays.<br><br>She has a sister named Vanessa Johansson, a brother named Adrian, and a twin brother named Hunter Johansson born three minutes after her. She began her acting career starring as Laura Nelson in the comedy film North (1994).<br><br>The acclaimed drama film The Horse Whisperer (1998) brought Johansson critical praise and worldwide recognition. Following the film\'s success, she starred in many other films including the critically acclaimed cult film Ghost World (2001) and then the hit Lost in Translation (2003) with Bill Murray in which she again stunned critics. Later on, she appeared in the drama film Girl with a Pearl Earring (2003).'
    };

    function _createLayout() {
        this.layout = new ScrollController({
            mouseMove: true,
            autoPipeEvents: true,
            layout: function(context, options) {
                context.set('background', {
                    size: context.size
                });
                var image = context.set('image', {
                    size: this.options.imageSize,
                    translate: [(context.size[0] - this.options.imageSize[0]) / 2, context.scrollOffset + 20, 1],
                    scale: this.options.imageScale,
                    scrollLength: 20 + this.options.imageSize[1]
                });
                var name = context.set('name', {
                    size: [context.size[0], this.options.nameHeight],
                    translate: [0, image.size[1] + image.translate[1], 1],
                    scrollLength: this.options.nameHeight
                });
                var textSize = context.resolveSize('text', context.size);
                context.set('text', {
                    size: [context.size[0], textSize[1]],
                    translate: [0, name.translate[1] + name.size[1], 1],
                    scrollLength: textSize[1] + 20
                });
            }.bind(this)
        });
        this.add(this.layout);
        this.layout.pipe(this._eventOutput);

        this.layout.on(['swipestart', 'swipeupdate'], function(event) {
            console.log('swipestart, delta: ' + event.delta + ', total: ' + event.total);
        });
        /*this.layout.on('swipeupdate', function(event) {
            console.log('swipeupdate, delta: ' + event.delta + ', total: ' + event.total);
        });*/
        this.layout.on('swipeend', function(event) {
            console.log('swipeend, delta: ' + event.delta + ', total: ' + event.total + ', velocity: ' + event.velocity);
        });
    }

    function _createRenderables() {
        this._renderables = {
            background: new Surface({
                classes: this.options.classes.concat(['background'])
            }),
            image: new BkImageSurface({
                classes: this.options.classes.concat(['image']),
                content: require('../images/scarlett.jpg'),
                sizeMode: 'cover'
            }),
            name: new Surface({
                classes: this.options.classes.concat(['name']),
                content: '<div>Scarlett Johansson</div>'
            }),
            text: new Surface({
                classes: this.options.classes.concat(['text']),
                content: this.options.profileText,
                size: [undefined, true]
            })
        };
        this.layout.setDataSource(this._renderables);
    }

    function _setupListeners() {
        this.on('click', function() {
            this.navItem.navBarController.push(new TextView());
        }.bind(this));
    }

    ProfileView.prototype.setNavigationItem = function(navItem) {
        this.navItem = navItem;
        navItem.navBar.setTitle('Profile');
    };

    module.exports = ProfileView;
});
