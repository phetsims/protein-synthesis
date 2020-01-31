// Copyright 2016, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 */
define( require => {
  'use strict';

  // modules
  var proteinSynthesis = require( 'PROTEIN_SYNTHESIS/proteinSynthesis' );

  var ProteinSynthesisQueryParameters = QueryStringMachine.getAll( {

    //TODO document
    translation: { type: 'flag' },
    randomStrand: { type: 'flag' },
    test: { type: 'flag' },
    testCodonTable: { type: 'flag' },
    aminoAcids: { type: 'flag' }
  } );

  proteinSynthesis.register( 'ProteinSynthesisQueryParameters', ProteinSynthesisQueryParameters );

  return ProteinSynthesisQueryParameters;
} );
