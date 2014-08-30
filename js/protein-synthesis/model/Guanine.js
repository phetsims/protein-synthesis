//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the Guanine, includes its shape and metrics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BaseShape = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/BaseShape' );
  var Base = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Base' );

  /**
   * Main constructor for Guanine, which creates the bar magnet..
   * @constructor
   */
  function Guanine() {
    Base.call( this, new BaseShape( function() {
      var lastPoint = this.getLastPoint();
      this.arc( lastPoint.x + this.topConnectorWidth / 2, lastPoint.y, this.topConnectorWidth / 2, Math.PI, 0, false );
    } ), 'G' );
  }

  return inherit( Base, Guanine, {

    // Resets all model elements
    reset: function() {
    },

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function() {
      // Handle model animation here.
    }
  } );
} );