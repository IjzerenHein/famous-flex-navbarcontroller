/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2015
 */

/**
 * NavBarController.
 *
 * @module
 */
define(function(require, exports, module) {

    // import dependencies
    var Surface = require('famous/core/Surface');
    var View = require('famous/core/View');
    var AnimationController = require('famous-flex/AnimationController');
    var LayoutController = require('famous-flex/LayoutController');
    var Easing = require('famous/transitions/Easing');
    var NavBar = require('./NavBar');
    var EventHandler = require('famous/core/EventHandler');
    var Transform = require('famous/core/Transform');

    /**
     * @class
     * @param {Object} options Configurable options.
     * @param {Number} [options.navBarPosition] Position (0: TOP, 1: BOTTOM) (default: TOP).
     * @param {Number} [options.navBarSize] Height of the navBar (default: 50).
     * @param {Number} [options.navBarZIndex] Z-index the navBar is put above the content (AnimationController) (default: 10).
     * @param {Object} [options.animationController] Options that are passed to the AnimationController.
     * @alias module:NavBarController
     */
    function NavBarController(options) {
        View.apply(this, arguments);

        this._navStack = [];

        _createLayout.call(this);
        _createRenderables.call(this);
        _setListeners.call(this);
    }
    NavBarController.prototype = Object.create(View.prototype);
    NavBarController.prototype.constructor = NavBarController;
    NavBarController.prototype.classes = ['ff-widget', 'ff-navbarctl'];

    /**
     * Default layout-function for the TabBarController. Supports simple
     * docking to any of the four edges.
     */
    NavBarController.DEFAULT_LAYOUT = function(context, options) {
        var navBar = context.set('navBarBackground', {
            size: [context.size[0], this.options.navBarSize],
            translate: [0, this.options.navBarPosition ? (context.size[1] - this.options.navBarSize) : 0, this.options.navBarZIndex]
        });
        context.set('navBarAC', {
            size: navBar.size,
            translate: [navBar.translate[0], navBar.translate[1], navBar.translate[2] + 1]
        });
        var content = context.set('background', {
            size: [context.size[0], context.size[1] - this.options.navBarSize],
            translate: [0, this.options.navBarPosition ? 0 : this.options.navBarSize, 0]
        });
        context.set('contentAC', {
            size: content.size,
            translate: [content.translate[0], content.translate[1], content.translate[2] + 1]
        });
    };

    NavBarController.NavBarSlideLeftAndFade = function(show, size) {
        return {
            transform: Transform.translate(show ? size[0] : -size[0], 0, 0),
            opacity: (this && (this.opacity !== undefined)) ? this.opacity : 0
        };
    };

    NavBarController.NavBarSlideRightAndFade = function(show, size) {
        return {
            transform: Transform.translate(show ? -size[0] : size[0], 0, 0),
            opacity: (this && (this.opacity !== undefined)) ? this.opacity : 0
        };
    };

    NavBarController.DEFAULT_OPTIONS = {
        navBarPosition: 0,
        navBarSize: 50,
        navBarZIndex: 10,
        transition: {duration: 300, curve: Easing.outQuad},
        animations: {
            show: {
                navBar: NavBarController.NavBarSlideLeftAndFade,
                view: AnimationController.Animation.Slide.Left
            },
            hide: {
                navBar: NavBarController.NavBarSlideRightAndFade,
                view: AnimationController.Animation.Slide.Right
            }
        },
        createRenderables: {
            navBarBackground: true,
            background: true
        },
        navBarAnimationController: {
            transfer: {
                zIndez: 1,
                items: {
                    'backIcon': 'backIcon'
                }
            }
        }
    };

    /**
     * Creates the outer (header-footer) layout.
     */
    function _createLayout() {
        this.layout = new LayoutController(this.options.layoutController);
        this.layout.setLayout(NavBarController.DEFAULT_LAYOUT.bind(this));
        this.add(this.layout);
    }

    /**
     * Creates a new renderable for the given renderable-id.
     *
     */
    function _createRenderable (id, data) {
        var option = this.options.createRenderables[id];
        if (option instanceof Function) {
            return option.call(this, id, data);
        }
        else if (!option) {
            return undefined;
        }
        if ((data !== undefined) && (data instanceof Object)) {
            return data;
        }
        var surface = new Surface({
            classes: this.classes,
            content: data ? ('<div>' + data + '</div>') : undefined
        });
        if (id === 'navBarBackground') {
            surface.addClass('ff-navbar');
            surface.addClass('background');
        }
        else {
            surface.addClass(id);
        }
        return surface;
    }

    /**
     * Creates the renderables.
     */
    function _createRenderables() {
        this.navBarAC = new AnimationController(this.options.navBarAnimationController);
        this.navBarAC.setOptions({transition: this.options.transition});
        this.contentAC = new AnimationController(this.options.animationController);
        this.contentAC.setOptions({transition: this.options.transition});
        this._renderables = {
            navBarBackground: _createRenderable.call(this, 'navBarBackground'),
            navBarAC: this.navBarAC,
            contentBackground: _createRenderable.call(this, 'background'),
            contentAC: this.contentAC
        };

        this.layout.setDataSource(this._renderables);
    }

    /**
     * Sets the listeners.
     */
    function _setListeners() {
        // TODO
    }

    /**
     * Patches the TabBarController instance's options with the passed-in ones.
     *
     * @param {Object} options Configurable options.
     * @param {Number} [options.navBarPosition] Position (0: TOP, 1: BOTTOM) (default: TOP).
     * @param {Number} [options.navBarSize] Height of the navBar (default: 50).
     * @param {Number} [options.navBarZIndex] Z-index the navBar is put above the content (AnimationController) (default: 10).
     * @param {Object} [options.animationController] Options that are passed to the AnimationController.
     * @return {NavBarController} this
     */
    NavBarController.prototype.setOptions = function(options) {
        View.prototype.setOptions.call(this, options);
        if (this.layout && options.layoutController) {
            this.layout.setOptions(options.layoutController);
        }
        if (this.contentAC && options.animationController) {
            this.contentAC(options.animationController);
        }
        if (this.navBarAC && options.transition) {
            this.navBarAC.setOptions({transition: this.options.transition});
            this.contentAC.setOptions({transition: this.options.transition});
        }
        if (this.layout) {
            this.layout.reflowLayout();
        }
        return this;
    };

    /**
     * Shows a new view.
     *
     * @param {Renderable} renderable View/surface to show.
     * @param {Object} [transition] Transition.
     * @param {Function} [callback] Callback function.
     * @return {Object} Navigation-item object
     */
    NavBarController.prototype.show = function(renderable, transition, callback) {

        // Create new nav-item
        var navItem = {
            renderable: renderable,
            navBar: new NavBar(this.options.navBar),
            navBarController: this,
            _eventOutput: new EventHandler()
        };
        EventHandler.setOutputHandler(navItem, navItem._eventOutput);
        var prevNavItem = this._navStack.length ? this._navStack[this._navStack.length - 1] : undefined;
        this._navStack.push(navItem);

        // Hookup navbar
        navItem.navBar.setBackButton(prevNavItem ? prevNavItem.navBar.getTitle() : undefined);
        navItem.navBar.on('back', this.hide.bind(this));

        // Inform view of the navigation
        if (navItem.renderable.setNavigation) {
            navItem.renderable.setNavigation(navItem);
        }

        // Notify views
        var event = {
            target: this
        };
        if (prevNavItem) {
            prevNavItem._eventOutput.emit('starthide', event);
        }
        navItem._eventOutput.emit('startshow', event);

        // Show view
        this.navBarAC.show(navItem.navBar, {
            animation: this.options.animations.show.navBar,
            transition: transition
        });
        this.contentAC.show(navItem.renderable, {
            animation: this.options.animations.show.view,
            transition: transition
        }, function() {
            if (prevNavItem) {
                prevNavItem._eventOutput.emit('endhide', event);
            }
            navItem._eventOutput.emit('endshow', event);
            if (callback) {
                callback();
            }
        });
        return navItem;
    };

    /**
     * Hides the current view.
     *
     * @param {Object} [transition] Transition.
     * @param {Function} [callback] Callback function.
     * @return {Object} Navigation-item object
     */
    NavBarController.prototype.hide = function(transition, callback) {
        if (!this._navStack.length) {
            return undefined;
        }
        var navItem = this._navStack.pop();
        var prevNavItem = this._navStack.length ? this._navStack[this._navStack.length - 1] : undefined;

        // Notify views
        var event = {
            target: this
        };
        navItem._eventOutput.emit('starthide', event);
        if (prevNavItem) {
            prevNavItem._eventOutput.emit('startshow', event);
        }

        // Show previous view
        this.navBarAC.show(prevNavItem ? prevNavItem.navBar : undefined, {
            animation: this.options.animations.hide.navBar,
            transition: transition
        });
        this.contentAC.show(prevNavItem ? prevNavItem.renderable : undefined, {
            animation: this.options.animations.hide.view,
            transition: transition
        }, function() {
            navItem._eventOutput.emit('endhide', event);
            if (prevNavItem) {
                prevNavItem._eventOutput.emit('endshow', event);
            }
            if (callback) {
                callback();
            }
        });

        return navItem;
    };

    module.exports = NavBarController;
});
