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

  // strings
  var proteinSynthesisTitleString = require( 'string!PROTEIN_SYNTHESIS/protein-synthesis.title' );

  /**
   * Creates the model and view for the ProteinSynthesisScreen
   * @constructor
   */
  function ProteinSynthesisScreen() {
    Screen.call( this, proteinSynthesisTitleString, null /* no icon, single-screen sim */,
      function() { return new ProteinSynthesisModel(); },
      function( model ) { return new ProteinSynthesisScreenView( model ); },
      {

        //The background is pale yellow (cytoplasm)
        backgroundColor: '#f6f3bd'
      }
    );
  }

  proteinSynthesis.register( 'ProteinSynthesisScreen', ProteinSynthesisScreen );
  
  return inherit( Screen, ProteinSynthesisScreen );
} );