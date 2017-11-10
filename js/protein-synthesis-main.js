// Copyright 2014-2017, University of Colorado Boulder

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
  var proteinSynthesisTitleString = require( 'string!PROTEIN_SYNTHESIS/protein-synthesis.title' );

  var simOptions = {
    credits: {

      // all credits fields are optional
      leadDesign: 'Sam & Ingrid Reid',
      softwareDevelopment: 'Sam Reid',
      team: 'Amy Spirk, Shane Freehling, Gina Martin, Kathy Perkins'
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( proteinSynthesisTitleString, [ new ProteinSynthesisScreen() ], simOptions );
    sim.start();
  } );
} );