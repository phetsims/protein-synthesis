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
  function BackboneBond( leftBaseNode, rightBaseNode ) {
    PropertySet.call( this, {} );
    this.leftBaseNode = leftBaseNode;
    this.rightBaseNode = rightBaseNode;
  }

  return inherit( PropertySet, BackboneBond, {

    contains: function( baseNode ) {
      return this.leftBaseNode === baseNode || this.rightBaseNode === baseNode;
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