// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for the Cytosine, includes its shape and metrics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Base = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Base' );
  var BaseShape = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/BaseShape' );
  var inherit = require( 'PHET_CORE/inherit' );
  var proteinSynthesis = require( 'PROTEIN_SYNTHESIS/proteinSynthesis' );

  /**
   * Main constructor for Cytosine, which creates the bar magnet..
   * @constructor
   */
  function Cytosine( backboneType ) {
    Base.call( this, new BaseShape( function() {
      var lastPoint = this.getLastPoint();
      this.arc( lastPoint.x + this.topConnectorWidth / 2, lastPoint.y, this.topConnectorWidth / 2, Math.PI, 0, true );
    } ), 'C', backboneType );
  }

  proteinSynthesis.register( 'Cytosine', Cytosine );
  
  return inherit( Base, Cytosine, {

    // Resets all model elements
    reset: function() {
    }
  } );
} );