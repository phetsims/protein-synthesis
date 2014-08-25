//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the Hydrogenbond, includes its shape and metrics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * Main constructor for BackboneBond, which creates the bar magnet..
   * @constructor
   */
  function BackboneBond( left, right ) {
    PropertySet.call( this, {} );
    this.left = left;
    this.right = right;
  }

  return inherit( PropertySet, BackboneBond, {

    contains: function( x ) {
      return this.left === x || this.right === x;
    },
    // Resets all model elements
    reset: function() {
    },

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function() {
      // Handle model animation here.
    }
  } );
} );