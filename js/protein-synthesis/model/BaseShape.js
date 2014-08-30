//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the Base, includes its shape and metrics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );

  var neckWidth = 8;
  var topConnectorHeight = 50;

  /**
   * Main constructor for Base, which creates the bar magnet..
   * @constructor
   */
  function BaseShape( topConnector ) {
    Shape.call( this );
    var curveLength = 8;
    var bodyHeight = 100;
    var bodyWidth = 140;
    var neck = 15;

    var topConnectorWidth = 40;
    this.topConnectorWidth = topConnectorWidth;

    //Starting out below (bottom right of) the ATCG element
    this.moveTo( 0, 0 );

    //Top Right Corner
    this.horizontalLineToRelative( bodyWidth / 2 - curveLength - topConnectorWidth / 2 );
    this.quadraticCurveToRelative( curveLength, 0, curveLength, curveLength );
    this.lineToRelative( 0, bodyHeight / 2 - curveLength - neckWidth / 2 );

    //Outie puzzle piece on the right
    //TODO: Make this smooth, as in the mockup.  Perhaps arc?  Or curveTo?
    this.horizontalLineToRelative( neck );
    this.smoothQuadraticCurveToRelative( 20, -15 );
    this.smoothQuadraticCurveToRelative( 20, 20 );
    this.smoothQuadraticCurveToRelative( -20, 20 );
    this.smoothQuadraticCurveToRelative( -20, -15 );
    this.horizontalLineToRelative( -neck );

    //Bottom Right Corner
    this.verticalLineToRelative( bodyHeight / 2 - curveLength - neckWidth / 2 );
    this.quadraticCurveToRelative( 0, curveLength, -curveLength, curveLength );

    //Bottom
    this.horizontalLineToRelative( -bodyWidth + curveLength * 2 );

    //Bottom Left Corner
    this.quadraticCurveToRelative( -curveLength, 0, -curveLength, -curveLength );

    //Bottom left edge
    this.verticalLineToRelative( -(bodyHeight / 2 - curveLength - neckWidth / 2) );

    //Innie on the left
    this.horizontalLineToRelative( neck );
    this.smoothQuadraticCurveToRelative( 20, 15 );
    this.smoothQuadraticCurveToRelative( 20, -20 );
    this.smoothQuadraticCurveToRelative( -20, -20 );
    this.smoothQuadraticCurveToRelative( -20, 15 );
    this.horizontalLineToRelative( -neck );

    //Left top
    this.verticalLineToRelative( -(bodyHeight / 2 - curveLength - neckWidth / 2) );

    //Top left corner
    this.quadraticCurveToRelative( 0, -curveLength, curveLength, -curveLength );

    //Top side, to the left of the ATGC connector
    this.horizontalLineToRelative( bodyWidth / 2 - curveLength - topConnectorWidth / 2 );

    //Top connector's left edge
    this.verticalLineToRelative( -topConnectorHeight );

    //path for top connector
    (topConnector.bind( this ))();

    //Top connector's right edge
    this.verticalLineToRelative( topConnectorHeight );
  }

  return inherit( Shape, BaseShape, {

    // Resets all model elements
    reset: function() {
    },

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function() {
      // Handle model animation here.
    }
  }, {
    NECK_WIDTH: neckWidth,
    TOP_CONNECTOR_HEIGHT: topConnectorHeight
  } );
} );