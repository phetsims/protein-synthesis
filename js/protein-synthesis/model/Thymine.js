// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for the Thymine, includes its shape and metrics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var proteinSynthesis = require( 'PROTEIN_SYNTHESIS/proteinSynthesis' );
  var inherit = require( 'PHET_CORE/inherit' );
  var BaseShape = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/BaseShape' );
  var Base = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Base' );

  /**
   * Main constructor for Thymine, which creates the bar magnet..
   * @constructor
   */
  function Thymine( backboneType ) {
    Base.call( this, new BaseShape( function() {

      //path for top connector
      this.lineToRelative( this.topConnectorWidth / 2, this.topConnectorWidth / 2 );
      this.lineToRelative( this.topConnectorWidth / 2, -this.topConnectorWidth / 2 );
    } ), 'T', backboneType );
  }

  proteinSynthesis.register( 'Thymine', Thymine );
  
  return inherit( Base, Thymine, {

    // Resets all model elements
    reset: function() {
    }
  } );
} );