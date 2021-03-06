// Copyright 2014-2017, University of Colorado Boulder

/**
 *
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  var ConnectionModel = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/ConnectionModel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var proteinSynthesis = require( 'PROTEIN_SYNTHESIS/proteinSynthesis' );

  /**
   *
   * @constructor
   */
  function TestTRNAConnectionPoints( screenView ) {
    var connectionModel = new ConnectionModel( 0, 0 );
    connectionModel.add( ConnectionModel.CENTER_INDEX + 0, 1, screenView.createMRNABaseNode( 'A' ) );
    connectionModel.add( ConnectionModel.CENTER_INDEX + 1, 1, screenView.createMRNABaseNode( 'U' ) );
    connectionModel.add( ConnectionModel.CENTER_INDEX + 2, 1, screenView.createMRNABaseNode( 'G' ) );

    var tRNA = screenView.createTRNANode( 'UAC' );
    var result = connectionModel.getConnectionPointsForTRNA( screenView, tRNA );
    console.log( result );
  }

  proteinSynthesis.register( 'TestTRNAConnectionPoints', TestTRNAConnectionPoints );
  
  return inherit( Object, TestTRNAConnectionPoints, {

    test: function() {}
  } );
} );