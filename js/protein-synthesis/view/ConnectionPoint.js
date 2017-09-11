// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for the 'ProteinSynthesis' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var proteinSynthesis = require( 'PROTEIN_SYNTHESIS/proteinSynthesis' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Constructor for the ConnectionPoint
   * @constructor
   */
  function ConnectionPoint( x, y, up, connect ) {
    this.x = x;
    this.y = y;
    this.up = up;
    this.connect = connect;
  }

  proteinSynthesis.register( 'ConnectionPoint', ConnectionPoint );
  
  return inherit( Object, ConnectionPoint, {
    get point() {
      return new Vector2( this.x, this.y );
    }
  } );
} );