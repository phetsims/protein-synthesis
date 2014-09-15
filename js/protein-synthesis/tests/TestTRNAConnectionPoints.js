//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ConnectionModel = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/ConnectionModel' );
  var Adenine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Adenine' );
  var Guanine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Guanine' );
  var Cytosine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Cytosine' );
  var Uracil = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Uracil' );


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

  return inherit( Object, TestTRNAConnectionPoints );
} );