// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for the Uracil, includes its shape and metrics.
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
   * Main constructor for Uracil, which creates the bar magnet..
   * @constructor
   */
  function Uracil( backboneType ) {
    Base.call( this, new BaseShape( function() {

      //path for top connector
      this.lineToRelative( this.topConnectorWidth / 2, this.topConnectorWidth / 2 );
      this.lineToRelative( this.topConnectorWidth / 2, -this.topConnectorWidth / 2 );
    } ), 'U', backboneType );
  }

  proteinSynthesis.register( 'Uracil', Uracil );
  
  return inherit( Base, Uracil, {

    // Resets all model elements
    reset: function() {
    }
  } );
} );