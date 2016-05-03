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
   * Main constructor for BackboneBond, which creates the bar magnet..
   * @constructor
   */
  function BackboneBond( leftBaseNode, rightBaseNode ) {
    PropertySet.call( this, {} );
    this.leftBaseNode = leftBaseNode;
    this.rightBaseNode = rightBaseNode;
  }

  proteinSynthesis.register( 'BackboneBond', BackboneBond );
  
  return inherit( PropertySet, BackboneBond, {

    contains: function( baseNode ) {
      return this.leftBaseNode === baseNode || this.rightBaseNode === baseNode;
    },
    
    // Resets all model elements
    reset: function() {
    }
  } );
} );