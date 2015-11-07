// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for the Adenine, includes its shape and metrics.
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
   * Main constructor for Adenine, which creates the bar magnet..
   * @constructor
   */
  function Adenine( backboneType ) {
    Base.call( this, new BaseShape( function() {

      //path for top connector
      this.lineToRelative( this.topConnectorWidth / 2, -this.topConnectorWidth / 2 );
      this.lineToRelative( this.topConnectorWidth / 2, this.topConnectorWidth / 2 );
    } ), 'A', backboneType );
  }

  return inherit( Base, Adenine, {

    // Resets all model elements
    reset: function() {
    }
  } );
} );