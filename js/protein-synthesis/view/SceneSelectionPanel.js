// Copyright 2014-2015, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var proteinSynthesis = require( 'PROTEIN_SYNTHESIS/proteinSynthesis' );
  var Text = require( 'SCENERY/nodes/Text' );

  var font = new PhetFont( 24 );

  function SceneSelectionPanel( connectionModel, stateProperty, options ) {

    var dnaButtonStateProperty = new Property( 'selected' );
    var transcriptionButtonStateProperty = new Property( 'disabled' );
    var translationButtonStateProperty = new Property( 'disabled' );

    var dnaText = new Text( 'DNA', { pickable: false, font: font, fill: 'white' } );
    var transcriptionText = new Text( 'Transcription', { pickable: false, font: font, fill: 'gray' } );
    var translationText = new Text( 'Translation', { pickable: false, font: font, fill: 'gray' } );

    var dnaPanel = new Panel( dnaText, { lineWidth: 2, fill: '#1c4ec1', backgroundPickable: true, cursor: 'pointer' } );
    var transcriptionPanel = new Panel( transcriptionText, {
      lineWidth: 1,
      stroke: 'gray',
      fill: null,
      backgroundPickable: true,
      cursor: 'pointer'
    } );
    var translationPanel = new Panel( translationText, {
      lineWidth: 1,
      stroke: 'gray',
      fill: null,
      backgroundPickable: true,
      cursor: 'pointer'
    } );

    var updateButtonStates = function() {
      var state = stateProperty.value;
      dnaButtonStateProperty.value = state === 'dna' ? 'selected' :
                                     'disabled';
      transcriptionButtonStateProperty.value = state === 'transcription' ? 'selected' :
                                               (state === 'dna' && connectionModel.isReadyForTranscription) ? 'enabled' :
                                               'disabled';
      translationButtonStateProperty.value = state === 'transcription' && connectionModel.isReadyForTranslation ? 'enabled' :
                                             state === 'translation' ? 'selected' :
                                             'disabled';
    };

    stateProperty.link( updateButtonStates );

    //when the user has created a 3-base strand in the coding strand, and it is contiguous, allow them to go to transcription
    //TODO: Could tooltip over the transcription button if it would be helpful
    connectionModel.changedEmitter.addListener( function() {
      updateButtonStates();
    } );

    var syncButton = function( buttonStateProperty, text, panel, panelFill ) {
      buttonStateProperty.link( function( buttonState ) {
        text.fill = buttonState === 'selected' ? 'black' :
                    buttonState === 'enabled' ? 'white' :
                    'gray';
        panel.stroke = buttonState === 'selected' ? null :
                       buttonState === 'enabled' ? 'black' :
                       'gray';
        panel.fill = buttonState === 'selected' ? null :
                     buttonState === 'enabled' ? panelFill :
                     null;
        panel.lineWidth = buttonState === 'selected' ? 0 :
                          buttonState === 'enabled' ? 1 :
                          0;

        panel.pickable = buttonState === 'enabled';
      } );
    };
    syncButton( dnaButtonStateProperty, dnaText, dnaPanel, 'white' );
    syncButton( transcriptionButtonStateProperty, transcriptionText, transcriptionPanel, '#aee6c8' );
    syncButton( translationButtonStateProperty, translationText, translationPanel, '#5D1A88' );

    dnaPanel.addInputListener( {
      down: function() {
        stateProperty.value = 'dna';
      }
    } );

    transcriptionPanel.addInputListener( {
      down: function() {
        stateProperty.value = 'transcription';
      }
    } );

    translationPanel.addInputListener( {
      down: function() {
        stateProperty.value = 'translation';
      }
    } );

    HBox.call( this, {
      resize: false, spacing: 10, children: [
        dnaPanel,
        new ArrowNode( 0, 0, 20, 0 ),
        transcriptionPanel,
        new ArrowNode( 0, 0, 20, 0 ),
        translationPanel
      ]
    } );
    this.mutate( options );
  }

  proteinSynthesis.register( 'SceneSelectionPanel', SceneSelectionPanel );

  return inherit( HBox, SceneSelectionPanel );
} );