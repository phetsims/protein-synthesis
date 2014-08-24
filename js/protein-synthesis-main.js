//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ProteinSynthesisScreen = require( 'PROTEIN_SYNTHESIS/protein-synthesis/ProteinSynthesisScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitle = require( 'string!PROTEIN_SYNTHESIS/protein-synthesis.name' );

  var simOptions = {
    credits: {

      // all credits fields are optional
      leadDesign: 'Sam & Ingrid Reid',
      softwareDevelopment: 'Sam Reid',
      designTeam: 'Sam & Ingrid Reid, Amy Spirk',
      interviews: 'Ingrid Reid'
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( window.phetcommon.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( simTitle, [ new ProteinSynthesisScreen() ], simOptions );
    sim.start();
  } );
} );