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
    var LayoutController = require('famous-flex/LayoutController');
    var BkImageSurface = require('famous-bkimagesurface/BkImageSurface');
    var ProfileView = require('./ProfileView');

    /**
     * @class
     * @param {Object} options Configurable options.
     * @param {Object} options.factory Factory delegate for creating new renderables.
     * @alias module:ProfileView
     */
    function FullImageView(options) {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createRenderables.call(this);
        _setupListeners.call(this);
    }
    FullImageView.prototype = Object.create(View.prototype);
    FullImageView.prototype.constructor = FullImageView;

    FullImageView.DEFAULT_OPTIONS = {
        classes: ['view', 'fullImage'],
        margins: [20, 20, 20, 20],
        textHeight: 30
    };

    function _createLayout() {
        this.layout = new LayoutController({
            autoPipeEvents: true,
            layout: function(context, options) {
                context.set('background', {
                    size: context.size
                });
                var imageSize = [
                    context.size[0] - this.options.margins[1] - this.options.margins[3],
                    context.size[1] - this.options.margins[0] - this.options.margins[2]
                ];
                if (imageSize[0] > imageSize[1]) {
                    imageSize[0] = imageSize[1];
                }
                else {
                    imageSize[1] = imageSize[0];
                }
                context.set('image', {
                    size: imageSize,
                    translate: [(context.size[0] - imageSize[0]) / 2, (context.size[1] - imageSize[1]) / 2, 1]
                });
                context.set('text', {
                    size: [context.size[0], this.options.textHeight],
                    translate: [0, context.size[1] - this.options.textHeight, 1]
                });
            }.bind(this)
        });
        this.add(this.layout);
        this.layout.pipe(this._eventOutput);
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
            text: new Surface({
                classes: this.options.classes.concat(['text']),
                content: this.options.text
            })
        };
        this.layout.setDataSource(this._renderables);
    }

    function _setupListeners() {
        this.on('click', function() {
            this.navItem.navBarController.push(new ProfileView());
        }.bind(this));
    }

    FullImageView.prototype.setNavigationItem = function(navItem) {
        this.navItem = navItem;
        navItem.navBar.setTitle('Image');
        navItem.on('starthide', function() {
            console.log('FullImageView -> starthide');
        });
        navItem.on('endhide', function() {
            console.log('FullImageView -> endhide');
        });
        navItem.on('startshow', function() {
            console.log('FullImageView -> startshow');
        });
        navItem.on('endshow', function() {
            console.log('FullImageView -> endshow');
        });
    };

    module.exports = FullImageView;
});
