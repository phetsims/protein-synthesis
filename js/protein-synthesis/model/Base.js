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
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * Main constructor for Base, which creates the bar magnet..
   * @constructor
   */
  function Base( shape, abbreviation ) {
    PropertySet.call( this, {angle: 0} );
    this.shape = shape;
    this.abbreviation = abbreviation;
  }

  return inherit( PropertySet, Base, {

    // Resets all model elements
    reset: function() {
    },

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function() {
      // Handle model animation here.
    }
  } );
} );