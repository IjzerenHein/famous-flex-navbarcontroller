/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2015
 */
define(function(require) {

    //<webpack>
    require('famous-polyfills');
    require('famous/core/famous.css');
    require('famous-flex/widgets/styles.css');
    require('./styles.css');
    require('./index.html');
    //</webpack>

    // Fast-click
    var FastClick = require('fastclick/lib/fastclick');
    FastClick.attach(document.body);

    // import dependencies
    var Engine = require('famous/core/Engine');
    var isMobile = require('ismobilejs');
    var NavBarController = require('./NavBarController');
    var FullImageView = require('./views/FullImageView');
    var PhoneFrameView = require('./PhoneFrameView');
    var MapView = require('famous-map/MapView');
    var Lagometer = require('famous-lagometer/Lagometer');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');

    // On mobile, disable app-mode and install the custom MapView
    // touch-handler so that Google Maps works.
    if (isMobile.any) {
        Engine.setOptions({appMode: false});
        MapView.installSelectiveTouchMoveHandler();
    }

    // create the main context
    var mainContext = Engine.createContext();

    // Create a nice phone frame
    var phoneFrameView = new PhoneFrameView();
    mainContext.add(phoneFrameView);

    // Create nav-bar controller
    var navBarController = new NavBarController({
        animationController: {
            transfer: {
                zIndez: 1000,
                items: {
                    'image': 'image'
                }
            }
        }
    });
    navBarController.push(new FullImageView());
    phoneFrameView.setContent(navBarController);

    // Show lagomter
    var modifier = new Modifier({
        size: [100, 100],
        align: [1.0, 0.0],
        origin: [1.0, 0.0],
        transform: Transform.translate(-10, 10, 10000)
    });
    var lagometer = new Lagometer({
        size: modifier.getSize() // required
    });
    //mainContext.add(modifier).add(lagometer);
});
