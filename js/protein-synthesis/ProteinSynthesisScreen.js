// Copyright 2014-2015, University of Colorado Boulder

/**
 * The 'Bar Magnet' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var proteinSynthesis = require( 'PROTEIN_SYNTHESIS/proteinSynthesis' );
  var ProteinSynthesisModel = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/ProteinSynthesisModel' );
  var ProteinSynthesisScreenView = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/ProteinSynthesisScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  /**
   * Creates the model and view for the ProteinSynthesisScreen
   * @constructor
   */
  function ProteinSynthesisScreen() {
    Screen.call( this,
      function() { return new ProteinSynthesisModel(); },
      function( model ) { return new ProteinSynthesisScreenView( model ); },
      { backgroundColor: '#f6f3bd' /* pale yellow (cytoplasm)*/ }
    );
  }

  proteinSynthesis.register( 'ProteinSynthesisScreen', ProteinSynthesisScreen );
  
  return inherit( Screen, ProteinSynthesisScreen );
} );