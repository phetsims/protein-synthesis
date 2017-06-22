// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for the Hydrogenbond, includes its shape and metrics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var proteinSynthesis = require( 'PROTEIN_SYNTHESIS/proteinSynthesis' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * Main constructor for HydrogenBond, which creates the bar magnet..
   * @constructor
   */
  function HydrogenBond( topBaseNode, bottomBaseNode ) {
    this.topBaseNode = topBaseNode;
    this.bottomBaseNode = bottomBaseNode;
  }

  proteinSynthesis.register( 'HydrogenBond', HydrogenBond );
  
  return inherit( PropertySet, HydrogenBond, {

    contains: function( baseNode ) {
      return this.topBaseNode === baseNode || this.bottomBaseNode === baseNode;
    },
    
    // Resets all model elements
    reset: function() {
    }
  } );
} );