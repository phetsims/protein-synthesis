// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for the 'ProteinSynthesis' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var proteinSynthesis = require( 'PROTEIN_SYNTHESIS/proteinSynthesis' );

  /**
   * Main constructor for ProteinSynthesisModel, which creates the bar magnet..
   * @constructor
   */
  function ProteinSynthesisModel() {
  }

  proteinSynthesis.register( 'ProteinSynthesisModel', ProteinSynthesisModel );
  
  return inherit( Object, ProteinSynthesisModel, {

    // Resets all model elements
    reset: function() {
    }
  } );
} );