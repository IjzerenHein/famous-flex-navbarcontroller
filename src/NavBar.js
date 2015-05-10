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
 * TabBar widget for famo.us.
 *
 * ```javascript
 * var TabBar = require('famous-flex/widgets/TabBar');
 *
 * var tabBar = new TabBar({
 *   classes: ['black'],
 *   createRenderables: {
 *     background: true,
 *     selectedItemOverlay: true,
 *     spacers: true
 *   }
 * });
 * tabBar.setItems([
 *   'one',
 *   'two',
 *   'three'
 * ]);
 * this.add(tabBar); // add to the render-tree
 *
 * tabBar.on('tabchange', function(event) {
 *   console.log('new tab selected: ' + event.index);
 * });
 * ```
 *
 * The surfaces that are created, use the the css-classes `ff-widget` and `ff-tabbar`.
 * You can add additional css-classes by using the `classes` option in the constructor.
 *
 * Example css styles for a black theme:
 *
 * ```css
 * .ff-tabbar.background.black {
 *   background-color: #101010;
 * }
 * .ff-tabbar.item.black {
 *   color: #f7f3f7;
 * }
 * .ff-tabbar.selectedItemOverlay.black {
 *   border-bottom: 6px solid #30b6e7;
 * }
 * .ff-tabbar.spacer.black:after {
 *   content: "";
 *   background-color: #333333;
 *   width: 100%;
 *   top: 10px;
 *   bottom: 10px;
 *   position: absolute;
 * }
 * ```
 *
 * @module
 */
define(function(require, exports, module) {

    // import dependencies
    var Surface = require('famous/core/Surface');
    var View = require('famous/core/View');
    var LayoutController = require('famous-flex/LayoutController');
    var NavBarLayout = require('famous-flex/layouts/NavBarLayout');

    /**
     * @class
     * @extends View
     * @param {Object} options Configurable options.
     * @param {Object} [options.navBarLayout] Layout-options that are passed to the NavBarLayout.
     * @param {Object} [options.layoutController] Options that are passed to the underlying layout-controller.
     * @param {Array.String} [options.classes] Css-classes that are added to the surfaces that are created.
     * @param {Object} [options.createRenderables] Options that specify which renderables should be created.
     * @alias module:NavBar
     */
    function NavBar(options) {
        View.apply(this, arguments);

        // init
        options = options || {};
        this.classes = options.classes ? this.classes.concat(options.classes) : this.classes;

        // create TabBar layout
        this.layout = new LayoutController(this.options.layoutController);
        this.add(this.layout);
        this.layout.pipe(this._eventOutput);

        // create initial renderables
        this._renderables = {
            background: _createRenderable.call(this, 'background')
        };
        this.layout.setDataSource(this._renderables);

        this._navigateBack = function() {
            this._eventOutput.emit('back', {
                target: this
            });
        }.bind(this);
        if (this._renderables.backIcon) {
            this._renderables.backIcon.on('click', this._navigateBack);
        }

        this.setOptions(this.options);
    }
    NavBar.prototype = Object.create(View.prototype);
    NavBar.prototype.constructor = NavBar;
    NavBar.prototype.classes = ['ff-widget', 'ff-navbar'];

    NavBar.DEFAULT_OPTIONS = {
        navBarLayout: {
            margins: [0, 0, 0, 0],
            spacing: 0,
            backIconWidth: 30
        },
        createRenderables: {
            background: false,
            title: true,
            backIcon: true,
            backItem: true
        },
        backIconContent: '<image src=\'data:image/svg+xml;utf8,<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" fill="#ffffff" style="enable-background:new 0 0 512 512;" xml:space="preserve"><polygon points="352,115.4 331.3,96 160,256 331.3,416 352,396.7 201.5,256 "/></svg>\' />',
        layoutController: {
            layout: NavBarLayout
        }
    };

    /**
     * Creates a new renderable for the given renderable-id.
     *
     */
    function _createRenderable (id, data) {
        var firstId = Array.isArray(id) ? id[0] : id;
        var option = this.options.createRenderables[firstId];
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
            classes: this.classes.concat(Array.isArray(id) ? id : [id]),
            content: data ? ('<div>' + data + '</div>') : undefined
        });
        if ((firstId === 'item') || (Array.isArray(id) && (id.indexOf('item') >= 0))) {
            surface.setSize([true, undefined]);
        }
        return surface;
    }

    /**
     * Patches the NavBar instance's options with the passed-in ones.
     *
     * @param {Object} options Configurable options.
     * @param {Object} [options.navBarLayout] Layout-options that are passed to the NavBarLayout.
     * @param {Object} [options.layoutController] Options that are passed to the underlying layout-controller.
     * @return {TabBar} this
     */
    NavBar.prototype.setOptions = function(options) {
        View.prototype.setOptions.call(this, options);
        if (!this.layout) {
            return this;
        }
        if (options.navBarLayout !== undefined) {
            this.layout.setLayoutOptions(options.navBarLayout);
        }
        if (options.layoutController) {
            this.layout.setOptions(options.layoutController);
        }
        return this;
    };

    /**
     * Sets the title of the nav-bar. The title can be either
     * a string or a renderable.
     *
     * @param {String|Renderable} title Title displayed in the center of the NavBar.
     * @return {NavBar} this
     */
    NavBar.prototype.setTitle = function(title) {

        // Remove any custom renderable
        this._title = this._title || {};
        this._title.text = undefined;
        this._title.customItem = undefined;
        if (!title) {
            this._renderables.title = undefined;
            this.layout.reflowLayout();
            return this;
        }
        if ((title instanceof String) || (typeof title === 'string')) {
            this._title.text = title;
            if (!this._title.item) {
                this._title.item = _createRenderable.call(this, ['title', 'item'], title);
            }
            else {
                this._title.item.setContent('<div>' + title + '</div>');
            }
            this._renderables.title = this._title.item;
        }
        else {
            this._title.customItem = title;
            this._renderables.title = this._title.customItem;
        }
        this.layout.reflowLayout();
        return this;
    };

    /**
     * Get the current title.
     *
     * @return {String|Renderable} string or custom renderable.
     */
    NavBar.prototype.getTitle = function() {
        this._title = this._title || {};
        return this._title.customItem || this._title.text;
    };

    /**
     * Sets the back button. The back-button can be either a string or a renderable.
     * To hide the backButton set it to `undefined`.
     *
     * @param {String|Renderable} backButton Back-button displayed at the left of the NavBar.
     * @return {NavBar} this
     */
    NavBar.prototype.setBackButton = function(backButton) {

        // Remove any custom renderable
        this._backButton = this._backButton || {};
        if (this._backButton.customItem && this._backButton.customItem.removeListener) {
            this._backButton.customItem.removeListener(this._navigateBack);
        }
        this._backButton.customItem = undefined;

        // Hide back button
        if (!backButton) {
            this._renderables.backIcon = undefined;
            this._renderables.backItem = undefined;
            this.layout.reflowLayout();
            return this;
        }

        // Create back-icon
        if (!this._backButton.icon) {
            this._backButton.icon = _createRenderable.call(this, 'backIcon', this.options.backIconContent);
            if (this._backButton.icon) {
                this._backButton.icon.on('click', this._navigateBack);
            }
            this._renderables.backIcon = this._backButton.icon;
        }

        // Set regular back item
        if ((backButton instanceof String) || (typeof backButton === 'string')) {
            if (!this._backButton.item) {
                this._backButton.item = _createRenderable.call(this, ['backItem', 'item'], backButton);
                if (this._backButton.item) {
                    this._backButton.item.on('click', this._navigateBack);
                }
            }
            else {
                this._backButton.item.setContent('<div>' + backButton + '</div>');
            }
            this._renderables.backItem = this._backButton.item;
        }
        else {
            this._backButton.customItem = backButton;
            this._backButton.customItem.on('click', this._navigateBack);
            this._renderables.backButton = this._backButton.customItem;
        }
        this.layout.reflowLayout();
        return this;
    };

    module.exports = NavBar;
});
