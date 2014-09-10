// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Panel = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/Panel' );
  var Property = require( 'AXON/Property' );

  var font = new PhetFont( 24 );

  function SceneSelectionPanel( connectionModel, stateProperty, options ) {

    var dnaButtonStateProperty = new Property( 'selected' );
    var transcriptionButtonStateProperty = new Property( 'disabled' );
    var translationButtonStateProperty = new Property( 'disabled' );

    var dnaText = new Text( 'DNA', {pickable: false, font: font, fill: 'white'} );
    var transcriptionText = new Text( 'Transcription', {pickable: false, font: font, fill: 'gray'} );
    var translationText = new Text( 'Translation', {pickable: false, font: font, fill: 'gray'} );

    var dnaPanel = new Panel( dnaText, {lineWidth: 2, fill: '#1c4ec1', backgroundPickable: true, cursor: 'pointer'} );
    var transcriptionPanel = new Panel( transcriptionText, {lineWidth: 1, stroke: 'gray', fill: null, backgroundPickable: true, cursor: 'pointer'} );
    var translationPanel = new Panel( translationText, {lineWidth: 1, stroke: 'gray', fill: null, backgroundPickable: true, cursor: 'pointer'} );

    var updateButtonStates = function() {
      var state = stateProperty.value;
      dnaButtonStateProperty.value = state === 'dna' ? 'selected' :
                                     state === 'transcription' ? 'enabled' :
                                     'disabled';
      transcriptionButtonStateProperty.value = state === 'transcription' ? 'selected' :
                                               (state === 'dna' && connectionModel.isReadyForTranslation) || state === 'translation' ? 'enabled' :
                                               "disabled";
      translationButtonStateProperty.value = state === 'transcription' ? 'enabled' :
                                             state === 'translation' ? 'selected' :
                                             'disabled';
    };

    transcriptionButtonStateProperty.debug( 'transcriptionButtonState' );

    stateProperty.link( updateButtonStates );

    //when the user has created a 3-base strand in the coding strand, and it is contiguous, allow them to go to transcription
    //TODO: Could tooltip over the transcription button if it would be helpful
    connectionModel.on( 'changed', function() {
      updateButtonStates();
    } );

    var syncButton = function( buttonStateProperty, text, panel ) {
      buttonStateProperty.link( function( buttonState ) {
        text.fill = buttonState === 'selected' ? 'white' :
                    buttonState === 'enabled' ? 'black' :
                    'gray';
        panel.stroke = buttonState === 'selected' ? 'black' :
                       buttonState === 'enabled' ? 'black' :
                       'gray';
        panel.fill = buttonState === 'selected' ? '#1c4ec1' :
                     buttonState === 'enabled' ? 'white' :
                     null;
        panel.lineWidth = buttonState === 'selected' ? 2 :
                          buttonState === 'enabled' ? 1 :
                          0;

        panel.pickable = buttonState === 'enabled';
      } );
    };
    syncButton( dnaButtonStateProperty, dnaText, dnaPanel );
    syncButton( transcriptionButtonStateProperty, transcriptionText, transcriptionPanel );
    syncButton( translationButtonStateProperty, translationText, translationPanel );

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