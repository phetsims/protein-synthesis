// Copyright 2014-2017, University of Colorado Boulder

/**
 * Model for the Base, includes its shape and metrics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var proteinSynthesis = require( 'PROTEIN_SYNTHESIS/proteinSynthesis' );

  /**
   * Main constructor for Base
   * @constructor
   */
  function Base( shape, abbreviation, backboneType ) {
    this.angleProperty = new Property( 0 );
    this.shape = shape;
    this.abbreviation = abbreviation;
    this.backboneType = backboneType;
  }

  proteinSynthesis.register( 'Base', Base );

  return inherit( Object, Base, {

    //For making tRNA in the codon table, show the pairing partners
    get partnerAbbreviation() {
      var result = this.abbreviation === 'A' ? 'U' :
                   this.abbreviation === 'U' ? 'A' :
                   this.abbreviation === 'C' ? 'G' :
                   this.abbreviation === 'G' ? 'C' : null;
      assert && assert( result !== null );
      return result;
    },
    // Resets all model elements
    reset: function() {
    },

    canHydrogenBond: function( base ) {
      return base.abbreviation === 'T' && this.abbreviation === 'A' ||
             base.abbreviation === 'A' && this.abbreviation === 'T' ||
             base.abbreviation === 'G' && this.abbreviation === 'C' ||
             base.abbreviation === 'C' && this.abbreviation === 'G' ||
             base.abbreviation === 'A' && this.abbreviation === 'U' ||
             base.abbreviation === 'U' && this.abbreviation === 'A';
    }
  } );
} );