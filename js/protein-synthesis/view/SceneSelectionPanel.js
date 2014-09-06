// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var Path = require( 'SCENERY/nodes/Path' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Panel = require( 'SUN/Panel' );

  var font = new PhetFont( 24 );

  function SceneSelectionPanel( options ) {
    HBox.call( this, {spacing: 10, children: [
      new Panel( new Text( 'DNA', {font: font, fill: 'white'} ), {lineWidth: 2, fill: '#1c4ec1'} ),
      new ArrowNode( 0, 0, 20, 0 ),
      new Panel( new Text( 'Transcription', {font: font, fill: 'gray'} ), {lineWidth: 1, stroke: 'gray', fill: null} ),
      new ArrowNode( 0, 0, 20, 0 ),
      new Panel( new Text( 'Translation', {font: font, fill: 'gray'} ), {lineWidth: 1, stroke: 'gray', fill: null} )
    ]} );
    this.mutate( options );
  }

  return inherit( HBox, SceneSelectionPanel );
} );