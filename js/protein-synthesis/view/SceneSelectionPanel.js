// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Panel = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/Panel' );

  var font = new PhetFont( 24 );

  function SceneSelectionPanel( stateProperty, options ) {
    var dnaText = new Text( 'DNA', {pickable: false, font: font, fill: 'white'} );
    var transcriptionText = new Text( 'Transcription', {pickable: false, font: font, fill: 'gray'} );
    var translationText = new Text( 'Translation', {pickable: false, font: font, fill: 'gray'} );

    var dnaPanel = new Panel( dnaText, {lineWidth: 2, fill: '#1c4ec1', backgroundPickable: true, cursor: 'pointer'} );
    var transcriptionPanel = new Panel( transcriptionText, {lineWidth: 1, stroke: 'gray', fill: null, backgroundPickable: true, cursor: 'pointer'} );
    var translationPanel = new Panel( translationText, {lineWidth: 1, stroke: 'gray', fill: null, backgroundPickable: true, cursor: 'pointer'} );

    stateProperty.link( function( state ) {
      dnaText.fill = (state === 'dna') ? 'white' : 'gray';
      transcriptionText.fill = (state === 'transcription') ? 'white' : 'gray';
      translationText.fill = (state === 'translation') ? 'white' : 'gray';

      dnaPanel.stroke = (state === 'dna') ? 'black' : 'gray';
      transcriptionPanel.stroke = (state === 'transcription') ? 'black' : 'gray';
      translationPanel.stroke = (state === 'translation') ? 'black' : 'gray';

      dnaPanel.fill = (state === 'dna') ? '#1c4ec1' : null;
      transcriptionPanel.fill = (state === 'transcription') ? '#1c4ec1' : null;
      translationPanel.fill = (state === 'translation') ? '#1c4ec1' : null;

      dnaPanel.lineWidth = (state === 'dna') ? 2 : 1;
      transcriptionPanel.lineWidth = (state === 'transcription') ? 2 : 1;
      translationPanel.lineWidth = (state === 'translation') ? 2 : 1;

      dnaPanel.fill = (state === 'dna') ? '#1c4ec1' : null;
      transcriptionPanel.fill = (state === 'transcription') ? '#1c4ec1' : null;
      translationPanel.fill = (state === 'translation') ? '#1c4ec1' : null;
    } );

    dnaPanel.addInputListener( {down: function() {
      stateProperty.value = 'dna';
    }} );

    transcriptionPanel.addInputListener( {down: function() {
      stateProperty.value = 'transcription';
    }} );

    translationPanel.addInputListener( {down: function() {
      stateProperty.value = 'translation';
    }} );

    HBox.call( this, {resize: false, spacing: 10, children: [
      dnaPanel,
      new ArrowNode( 0, 0, 20, 0 ),
      transcriptionPanel,
      new ArrowNode( 0, 0, 20, 0 ),
      translationPanel
    ]} );
    this.mutate( options );
  }

  return inherit( HBox, SceneSelectionPanel );
} );