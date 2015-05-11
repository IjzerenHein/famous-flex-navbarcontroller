NavBarController Tutorial
==========

The NavBarController manages a horizontal stack of views. It combines a NavBar widget and
an AnimationController for performing left & right slide animations.

![Screenshot](../screenshot.gif)

[View the live demo here](https://rawgit.com/IjzerenHein/famous-flex-navbarcontroller/master/dist/index.html)


# Index

- [Getting started](#getting-started)
- API reference
  - [NavBarController](https://github.com/IjzerenHein/famous-flex/blob/master/docs/widgets/NavBarController.md)
  - [NavBar](https://github.com/IjzerenHein/famous-flex/blob/master/docs/widgets/NavBar.md)
- [Code examples](../src/main.js)
- [Configuration](#configuration)
  - [Size and position of the NavBar](size-and-position-of-the-navbar)
  - [Configuring the NavBar](#configuring-the-navbar)
  - [Configuring the show & hide transitions](#configuring-the-show--hide-transitions)
- [Showing & hiding views](#showing--hiding-views)
- [NavBarController aware views](#navbarcontroller-aware-views)
  - [Setting the title](#setting-the-title)
  - [Pushing another view onto the navigation-stack](pushing-another-view-onto-the-navigation-stack)
  - [Handling show & hide events](#handling-show--hide-events)


# Getting started

To use NavBarController in your project, install famous-flex using npm or bower:

    npm install famous-flex

    bower install famous-flex


To create a NavBarController, use:

```javascript
var NavBarController = require('famous-flex/widgets/NavBarController');

// Create navbar-controller
var navBarController = new NavBarController({
    navBarSize: 66,
    navBar: {
        navBarLayout: {
            margins: [22, 5, 0, 5]
        }
    },
    animationController: {
        transfer: {
            'logo': 'logo'
        }
    }
});
this.add(navBarController); // add to render-tree

// Set title in NavBar when view is shown
MyRootView.prototype.setNavigationItem = function(navItem) {
    this.navItem = navItem;
    navItem.navBar.setTitle('Root');
};

// Show initial view
navBarController.push(new MyRootView());


```


# Configuration

## Size & position of the NavBar

To configure the size & position of the NavBar use the constructor or `setOptions`:

```javascript
navBarController = new NavBarController({
    navBarPosition: NavBarController.Position.TOP
    navBarSize: 60 // height of the nav-bar (default: 50)
    navBarZIndex: // Z-index the nav-bar is moved in front (default: 10)
})
```

Supported positions:

|position         |description|
|-----------------|-----------|
|`Position.TOP`   |Positions the nav-bar at the top. **(default)**|
|`Position.BOTTOM`|Positions the nav-bar at the bottom.|



## Configuring the NavBar

To configure the default NavBar options, either use the constructor or `setOptions`:

```javascript
navBarController = new navBarController({
    navBar: {
        classes: ['mynavbar'],
        navBarLayout: {
            margins: [22, 5, 0, 5]
        }
    }
})
```

**For a full overview of all the options, see the NavBar documentation:**
- [NavBar API Reference](https://github.com/IjzerenHein/famous-flex/blob/master/docs/widgets/NavBar.md)


## Configuring the show & hide transitions

To set the transition (speed) that is used to show and hide views, use the `transition` option:

```javascript
navBarController = new NavBarController({
    transition: {duration: 300, curve: Easing.outQuad}
})
```


# Showing and hiding views

To show or hide a view use the `push` and `pop` functions:

```javascript
.push(renderable, options, callback);
.pop(options, callback)
```

When you create the NavBarController, you typically create a "root" view and push it to the
NavBarController. Additional views can be pushed to the navigation-stack by calling `push` on the NavBarController.


# NavBarController aware views

Whenever a view is pushed to the NavBarController, `setNavigationItem` is called on the view and
a "navigation-item" is passed along. A navigation-item is an object containing a reference to the
NavBarController and the NavBar associated with that view. The navigation-item can be used to
update the NavBar, access the NavBarController, but also to capture "show" and "hide" events.

A navigation-item is an Object with the following members:

```javascript
{
    navBar,          // NavBar associated with the view
    navBarController // NavBarController to which whom the view was added
}
```

## Setting the title

The following example shows a simple view implementing the `setNavigationItem` function and setting
the title:

```javascript
function MyView(options) {
    View.apply(this, arguments);
    ...
}
MyView.prototype = Object.create(View.prototype);
MyView.prototype.constructor = MyView;

// Update the title when the view is added to the NavBarController
MyView.prototype.setNavigationItem = function(navItem) {
    this.navItem = navItem;
    navItem.navBar.setTitle('Details');
};
```

## Pushing another view onto the navigation-stack

To push another view onto the navigation-stack, use the `navigationController`
member from the navigation-item:

```javascript
OverView.prototype.setNavigationItem = function(navItem) {
    this.navItem = navItem; // store the navigation-item so we can use it later
    navItem.navBar.setTitle('Overview');
};

OverView.prototype.onSomeEvent = function(data) {
    this.navItem.navBarController.push(new DetailView(data));
};
```

## Handling show & hide events

Whenever a view is shown or hidden, the navigation-item emits various events
to inform the view of this action. The following example shows how to hook into
these events:

```javascript
OverView.prototype.setNavigationItem = function(navItem) {
    this.navItem = navItem; // store the navigation-item so we can use it later
    navItem.on('startshow', function(event) {
        // view is about to be shown because of a push or pop operation
        console.log((event.push ? 'push' : 'pop') + ': startshow');
    });
    navItem.on('endshow', function(event) {
        // view has been shown because of a push or pop operation
        console.log((event.push ? 'push' : 'pop') + ': endshow');
    });
    navItem.on('starthide', function(event) {
        // view is about to be hidden because of a push or pop operation
        console.log((event.push ? 'push' : 'pop') + ': starthide');
    });
    navItem.on('endhide', function(event) {
        // view has been hidden because of a push or pop operation
        console.log((event.push ? 'push' : 'pop') + ': endhide');
    });
};

```


*© 2015 IjzerenHein*
