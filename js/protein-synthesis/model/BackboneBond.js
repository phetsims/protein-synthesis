// Copyright 2014-2017, University of Colorado Boulder

/**
 * Model for the Hydrogenbond, includes its shape and metrics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var proteinSynthesis = require( 'PROTEIN_SYNTHESIS/proteinSynthesis' );

  /**
   * Main constructor for BackboneBond, which creates the bar magnet..
   * @constructor
   */
  function BackboneBond( leftBaseNode, rightBaseNode ) {
    this.leftBaseNode = leftBaseNode;
    this.rightBaseNode = rightBaseNode;
  }

  proteinSynthesis.register( 'BackboneBond', BackboneBond );

  return inherit( Object, BackboneBond, {

    contains: function( baseNode ) {
      return this.leftBaseNode === baseNode || this.rightBaseNode === baseNode;
    },

    // Resets all model elements
    reset: function() {
    }
  } );
} );