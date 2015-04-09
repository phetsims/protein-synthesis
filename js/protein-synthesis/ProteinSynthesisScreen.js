// Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'Bar Magnet' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ProteinSynthesisModel = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/ProteinSynthesisModel' );
  var ProteinSynthesisScreenView = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/ProteinSynthesisScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var ProteinSynthesisSimString = require( 'string!PROTEIN_SYNTHESIS/protein-synthesis.name' );

  /**
   * Creates the model and view for the ProteinSynthesisScreen
   * @constructor
   */
  function ProteinSynthesisScreen() {
    Screen.call( this, ProteinSynthesisSimString, null /* no icon, single-screen sim */,
      function() { return new ProteinSynthesisModel(); },
      function( model ) { return new ProteinSynthesisScreenView( model ); },
      {

        //The background is pale yellow (cytoplasm)
        backgroundColor: '#f6f3bd'
      }
    );
  }

  return inherit( Screen, ProteinSynthesisScreen );
} );