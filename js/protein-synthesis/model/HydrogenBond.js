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
   * Main constructor for HydrogenBond, which creates the bar magnet..
   * @constructor
   */
  function HydrogenBond( topBaseNode, bottomBaseNode ) {
    this.topBaseNode = topBaseNode;
    this.bottomBaseNode = bottomBaseNode;
  }

  proteinSynthesis.register( 'HydrogenBond', HydrogenBond );

  return inherit( Object, HydrogenBond, {

    contains: function( baseNode ) {
      return this.topBaseNode === baseNode || this.bottomBaseNode === baseNode;
    },
    
    // Resets all model elements
    reset: function() {
    }
  } );
} );