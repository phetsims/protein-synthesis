// Copyright 2014-2017, University of Colorado Boulder

/**
 * Model for the Guanine, includes its shape and metrics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  var Base = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Base' );
  var BaseShape = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/BaseShape' );
  var inherit = require( 'PHET_CORE/inherit' );
  var proteinSynthesis = require( 'PROTEIN_SYNTHESIS/proteinSynthesis' );

  /**
   * Main constructor for Guanine, which creates the bar magnet..
   * @constructor
   */
  function Guanine( backboneType ) {
    Base.call( this, new BaseShape( function() {
      var lastPoint = this.getLastPoint();
      this.arc( lastPoint.x + this.topConnectorWidth / 2, lastPoint.y, this.topConnectorWidth / 2, Math.PI, 0, false );
    } ), 'G', backboneType );
  }

  proteinSynthesis.register( 'Guanine', Guanine );
  
  return inherit( Base, Guanine, {

    // Resets all model elements
    reset: function() {
    }
  } );
} );