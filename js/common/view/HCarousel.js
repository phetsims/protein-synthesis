// Copyright 2002-2014, University of Colorado Boulder

/**
 * A 'carousel' user interface component that can contain multiple Scenery nodes and which the user can cycle through.
 *
 * Copied from Area-Builder on 8/23/2014.  TODO: Should be merged back together (probably in a common repo) in before production.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var RectangularButtonView = require( 'SUN/buttons/RectangularButtonView' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  // constants
  var ARROW_WIDTH = 7;
  var ARROW_HEIGHT = 20;
  var BUTTON_X_MARGIN = 4;
  var BUTTON_MIN_Y_MARGIN = 5;
  var MIN_INTER_ITEM_SPACING = 10;
  var CONTENT_Y_MARGIN = 5;
  var CORNER_RADIUS = 4;
  var BUTTON_BASE_COLOR = 'rgba( 200, 200, 200, 0.5 )';

  /**
   * @param {Array<Node>} children
   * @param {Object} options
   * @constructor
   */
  function HCarousel( children, options ) {
    Node.call( this );

    options = _.extend(
      {
        numVisibleAtOnce: 4,
        fill: 'white',
        stroke: 'black',
        lineWidth: 1
      }, options );

    // Figure out the maximum child width and height
    var maxChildWidth = 0;
    var maxChildHeight = 0;
    children.forEach( function( child ) {
      maxChildWidth = Math.max( maxChildWidth, child.bounds.width );
      maxChildHeight = Math.max( maxChildHeight, child.bounds.height );
    } );

    var panelHeight = Math.max( ARROW_HEIGHT + 2 * BUTTON_MIN_Y_MARGIN, CONTENT_Y_MARGIN * 2 + maxChildHeight );

    // Create the buttons that will be used to scroll through the contents.
    var iconOptions = { stroke: 'black', lineWidth: 3, lineCap: 'square' };
    var nextIcon = new Path( new Shape().moveTo( 0, 0 ).lineTo( ARROW_WIDTH, ARROW_HEIGHT / 2 ).lineTo( 0, ARROW_HEIGHT ), iconOptions );
    var previousIcon = new Path( new Shape().moveTo( ARROW_WIDTH, 0 ).lineTo( 0, ARROW_HEIGHT / 2 ).lineTo( ARROW_WIDTH, ARROW_HEIGHT ), iconOptions );
    var nextButton = new RectangularPushButton( {
      content: nextIcon,
      xMargin: BUTTON_X_MARGIN,
      buttonAppearanceStrategy: RectangularButtonView.flatAppearanceStrategy,
      baseColor: BUTTON_BASE_COLOR,
      cornerRadius: CORNER_RADIUS,
      minHeight: panelHeight,
      centerY: panelHeight / 2
    } );
    var previousButton = new RectangularPushButton( {
      content: previousIcon,
      xMargin: BUTTON_X_MARGIN,
      buttonAppearanceStrategy: RectangularButtonView.flatAppearanceStrategy,
      baseColor: BUTTON_BASE_COLOR,
      cornerRadius: CORNER_RADIUS,
      minHeight: panelHeight,
      centerY: panelHeight / 2
    } );

    var buttonWidth = nextButton.width;  // Assume both buttons are the same width.

    // Construct the outer container
    var panelWidth = buttonWidth * 2 +
                     MIN_INTER_ITEM_SPACING * 2 +
                     options.numVisibleAtOnce * maxChildWidth +
                     ( options.numVisibleAtOnce - 1 ) * MIN_INTER_ITEM_SPACING;
    this.addChild( new Rectangle( 0, 0, panelWidth, panelHeight, CORNER_RADIUS, CORNER_RADIUS, {
      fill: options.fill,
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } ) );

    // Add the buttons.
    this.addChild( nextButton );
    this.addChild( previousButton );

    // Position the rightmost button to be at the right edge of the panel.
    nextButton.right = panelWidth;

    // Add the content.  It is structured as a 'windowNode' that defines the clip area and a 'scrollingNode' that moves
    // beneath the clip window.
    var windowNode = new Node();
    windowNode.clipArea = new Shape.rect( previousButton.right + MIN_INTER_ITEM_SPACING / 2, 0,
        nextButton.left - previousButton.right - MIN_INTER_ITEM_SPACING, panelHeight );
    this.addChild( windowNode );
    var scrollingNode = new Rectangle( 0, 0,
        buttonWidth + children.length * ( maxChildWidth + 2 * MIN_INTER_ITEM_SPACING),
      panelHeight, 0, 0, { fill: 'rgba( 0, 0, 0, 0)' }
    );
    children.forEach( function( child, index ) {
      child.centerX = previousButton.right + MIN_INTER_ITEM_SPACING + maxChildWidth / 2 + index * ( maxChildWidth + MIN_INTER_ITEM_SPACING );
      child.centerY = panelHeight / 2;
      scrollingNode.addChild( child );
    } );
    windowNode.addChild( scrollingNode );

    // Set up the scrolling functions.
    var targetPosition = new Property( 0 );
    var scrollDistance = maxChildWidth + MIN_INTER_ITEM_SPACING;

    function scrollRight() {
      targetPosition.value += Math.min( -targetPosition.value, options.numVisibleAtOnce );
    }

    function scrollLeft() {
      var itemsToTheRight = children.length - ( targetPosition.value + options.numVisibleAtOnce );
      targetPosition.value -= Math.min( itemsToTheRight, options.numVisibleAtOnce );
    }

    targetPosition.link( function( pos ) {

      // Show/hide the navigation buttons.
      nextButton.visible = pos > options.numVisibleAtOnce - children.length;
      previousButton.visible = pos < 0;

      // Set up the animation to scroll to the next location.
      new TWEEN.Tween( scrollingNode ).to( { left: targetPosition.value * scrollDistance }, 400 ).easing( TWEEN.Easing.Cubic.InOut ).start();
    } );

    // Hook up the scrolling nodes to the buttons.
    nextButton.addListener( scrollLeft );
    previousButton.addListener( scrollRight );

    // Pass options through to parent class.
    this.mutate( options );
  }

  return inherit( Node, HCarousel );
} );