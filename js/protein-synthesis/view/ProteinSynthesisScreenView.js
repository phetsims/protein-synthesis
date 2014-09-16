//  Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'ProteinSynthesis' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Util = require( 'DOT/Util' );
  var TestTRNAConnectionPoints = require( 'PROTEIN_SYNTHESIS/protein-synthesis/tests/TestTRNAConnectionPoints' );
  var TRNANode = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/TRNANode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Adenine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Adenine' );
  var Thymine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Thymine' );
  var Uracil = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Uracil' );
  var Guanine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Guanine' );
  var Cytosine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Cytosine' );
  var BaseNode = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/BaseNode' );
  var Panel = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/Panel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BaseShape = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/BaseShape' );
  var PropertySet = require( 'AXON/PropertySet' );
  var CheckBox = require( 'SUN/CheckBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var RNACodonTable = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/RNACodonTable' );
  var SceneSelectionPanel = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/SceneSelectionPanel' );
  var RibosomeNode = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/RibosomeNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ConnectionModel = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/ConnectionModel' );

  //constants
  var translationScaleFactor = 0.75;

  /**
   * Constructor for the ProteinSynthesisScreenView
   * @constructor
   */
  function ProteinSynthesisScreenView( model ) {
    this.model = model;
    ScreenView.call( this, {renderer: 'svg', layoutBounds: ScreenView.UPDATED_LAYOUT_BOUNDS.copy()} );

    this.viewProperties = new PropertySet( {
      baseLabelsVisible: true,
      labelsVisible: false,
      state: 'dna',//[dna,transcription/translation]
      location: 'nucleus', // [nucleus/cytoplasm]
      numAminoAcids: 0
    } );

    //TODO: Rewrite resetAll using the normal conventions.
    this.initChildren();
  }

  return inherit( ScreenView, ProteinSynthesisScreenView, {

    //Normally all of this would be in the constructor.  However, to cope with impending deadlinens resetAll has been implemented
    //by reinitializing the model + view
    initChildren: function() {

      var proteinSynthesisScreenView = this;

      //Everything that should translate with the camera
      var worldNode = new Node();
      this.worldNode = worldNode;

      this.addChild( worldNode );
      var nucleusShape = new Circle( 1000, {fill: '#E2E9F7', stroke: 'black', lineWidth: 4, centerX: this.layoutBounds.centerX, centerY: this.layoutBounds.centerY} );
      worldNode.addChild( nucleusShape );

      //TODO: While dragging, show a drop shadow

      var resetAllButton = new ResetAllButton( {
        right: this.layoutBounds.maxX - 5,
        bottom: this.layoutBounds.maxY - 5,
        listener: function() {
          proteinSynthesisScreenView.model.reset();
          proteinSynthesisScreenView.viewProperties.reset();
          proteinSynthesisScreenView.removeAllChildren();
          proteinSynthesisScreenView.initChildren();
        }
      } );
      this.addChild( resetAllButton );

      this.attachedTRNANodes = [];
      //Put the dotted line to the top left so students will build left to right and things will fit into the ribosome (which is on the left side of the screen)
      this.dottedLine = new Rectangle( 0, 0, BaseShape.BODY_WIDTH, BaseShape.BODY_HEIGHT, 5, 5, {scale: 0.6, stroke: 'red', lineWidth: 3, lineDash: [6, 4], centerY: 150, centerX: this.layoutBounds.width / 4 + 30} );
      worldNode.addChild( this.dottedLine );
      var codingStrandLabel = new Text( 'Coding Strand', {font: new PhetFont( 18 ), left: this.dottedLine.left, bottom: this.dottedLine.top - 10} );
      this.viewProperties.labelsVisibleProperty.linkAttribute( codingStrandLabel, 'visible' );
      worldNode.addChild( codingStrandLabel );

      this.connectionModel = new ConnectionModel( this.dottedLine.centerX, this.dottedLine.centerY );
      this.connectionModel.on( 'changed', function() {
        //If something connected, stop showing the initial target
        proteinSynthesisScreenView.dottedLine.visible = proteinSynthesisScreenView.connectionModel.isEmpty;
      } );

      var toBaseNode = function( base ) {
        return new BaseNode( base, proteinSynthesisScreenView, proteinSynthesisScreenView.viewProperties.baseLabelsVisibleProperty, proteinSynthesisScreenView.viewProperties.labelsVisibleProperty, true, false );
      };
      var createBaseNodeStack = function( index, constructor ) {
        var children = [];
        var x = 260;
        var y = 387;
        for ( var i = 0; i < 5; i++ ) {
          var baseNode = toBaseNode( constructor() );
          console.log( index );
          baseNode.setInitialPosition( x + i * 2 + index * 100, y + i * 2 );
          children.push( baseNode );
        }
        return children;
      };

      var sceneSelectionPanel = new SceneSelectionPanel( this.connectionModel, this.viewProperties.stateProperty, {centerX: this.layoutBounds.centerX, bottom: this.layoutBounds.bottom - 4} );
      this.addChild( sceneSelectionPanel );

      var dnaStacks = [
        createBaseNodeStack( 0, function() {return new Adenine( 'deoxyribose' );} ),
        createBaseNodeStack( 1, function() {return new Thymine( 'deoxyribose' );} ),
        createBaseNodeStack( 2, function() {return new Guanine( 'deoxyribose' );} ),
        createBaseNodeStack( 3, function() {return new Cytosine( 'deoxyribose' );} )
      ];

      var dnaToolbox = new Rectangle( 0, 0, 450, 100, 10, 10, {fill: 'white', lineWidth: 1, stroke: 'black', centerX: this.layoutBounds.centerX, bottom: sceneSelectionPanel.top - 10} );
      dnaToolbox.addChild( new Text( 'DNA', {centerX: 450 / 2, bottom: 100 - 2} ) );
      worldNode.addChild( dnaToolbox );

      var dnaBases = [];
      var mRNABases = [];
      var i = 0;
      var j = 0;
      for ( i = 0; i < dnaStacks.length; i++ ) {
        var dnaStack = dnaStacks[i];
        for ( j = 0; j < dnaStack.length; j++ ) {
          worldNode.addChild( dnaStack[j] );
          dnaBases.push( dnaStack[j] );
        }
      }

      var mRNAStacks = [
        createBaseNodeStack( 0, function() {return new Adenine( 'ribose' );} ),
        createBaseNodeStack( 1, function() {return new Uracil( 'ribose' );} ),
        createBaseNodeStack( 2, function() {return new Guanine( 'ribose' );} ),
        createBaseNodeStack( 3, function() {return new Cytosine( 'ribose' );} )
      ];

      var mRNAToolbox = new Rectangle( 0, 0, 450, 100, 10, 10, {fill: 'white', lineWidth: 1, stroke: 'black', centerX: this.layoutBounds.centerX, bottom: sceneSelectionPanel.top - 10} );
      mRNAToolbox.addChild( new Text( 'mRNA', {centerX: 450 / 2, bottom: 100 - 2} ) );
      worldNode.addChild( mRNAToolbox );

      for ( i = 0; i < mRNAStacks.length; i++ ) {
        var mRNAStack = mRNAStacks[i];
        for ( j = 0; j < mRNAStack.length; j++ ) {
          var mRNABase = mRNAStack[j];
          mRNABases.push( mRNABase );
          worldNode.addChild( mRNABase );
        }
      }

      this.viewProperties.stateProperty.link( function( state ) {
        dnaToolbox.visible = state === 'dna';
        mRNAToolbox.visible = state === 'transcription' || state === 'translation';

        var i = 0;
        var base = null;

        //Any mRNA/DNA not in the connection model must be hidden too.
        if ( state === 'dna' ) {
          for ( i = 0; i < mRNABases.length; i++ ) {
            base = mRNABases[i];
            if ( !proteinSynthesisScreenView.connectionModel.contains( base ) ) {
              base.visible = false;
            }
          }
        }
        else {
          for ( i = 0; i < mRNABases.length; i++ ) {
            base = mRNABases[i];
            base.visible = true;
          }
        }
      } );

      var labelsCheckBox = new CheckBox( new Text( 'Labels', new PhetFont( 17 ) ), this.viewProperties.labelsVisibleProperty, {
        left: this.layoutBounds.left + 5,
        centerY: sceneSelectionPanel.centerY
      } );
      this.addChild( labelsCheckBox );

      var ribosomeNode = new RibosomeNode( this.viewProperties.labelsVisibleProperty );
      ribosomeNode.centerX = 2725;
      worldNode.addChild( ribosomeNode );

      this.viewProperties.stateProperty.link( function( state, oldState ) {
        if ( state === 'translation' && oldState === 'transcription' ) {

          new TWEEN.Tween( { progress: 0, x: 0} )
            .to( { progress: 1, x: 2000 }, 4000 )
            .easing( TWEEN.Easing.Cubic.InOut )
            .onUpdate( function() {
              proteinSynthesisScreenView.worldNode.x = this.x;
              var scale = Util.linear( 0, 1, 1, translationScaleFactor, this.progress );
              worldNode.x = -this.progress * 2000 * scale;
              //bring any mRNA out of the nucleus to the cytoplasm.
              worldNode.setScaleMagnitude( scale );
            } )
            .start();


          //TODO: Leftmost mRNA node should be parked directly in the ribosome
          var mrnaNodes = proteinSynthesisScreenView.connectionModel.bottomBaseNodes;
          proteinSynthesisScreenView.distanceMRNATranslated = 2000 + 414.2696199129823;
          mrnaNodes.forEach( function( baseNode ) {
            new TWEEN.Tween( { x: baseNode.x} )
              .to( { x: baseNode.x + proteinSynthesisScreenView.distanceMRNATranslated}, 3800 )
              .easing( TWEEN.Easing.Cubic.InOut )
              .onUpdate( function() {
                baseNode.x = this.x;
              } )
              .start();
          } );
        }
      } );

      var nonCodingStrand = [];
      this.viewProperties.stateProperty.link( function( state, oldState ) {
        if ( oldState === 'dna' && state === 'transcription' ) {
          console.log( 'imagine the strands separating' );
          nonCodingStrand.length = 0;

          //find all the base nodes on the bottom, move to the back and animate them south.
          var bottomBaseNodes = proteinSynthesisScreenView.connectionModel.bottomBaseNodes;
          bottomBaseNodes.forEach( function( baseNode ) {

            baseNode.originalY = baseNode.y;
            //TODO: Move these baseNodes behind the control panels
            worldNode.removeChild( baseNode );
            worldNode.insertChild( worldNode.indexOfChild( nucleusShape ) + 1, baseNode );

            proteinSynthesisScreenView.connectionModel.remove( baseNode );

            //Move away the non-coding strand when translation starts
            //TODO: var tween and cancel?
            new TWEEN.Tween( { y: baseNode.y} )
              .to( { y: baseNode.y + 500}, 1000 )
              .easing( TWEEN.Easing.Cubic.InOut )
              .onUpdate( function() {
                baseNode.y = this.y;
              } )
              .onComplete( function() {
                nonCodingStrand.push( baseNode );
              } )
              .start();
          } );
        }

        //TODO: Much duplicated code with the above
        else if ( oldState === 'transcription' && state === 'translation' ) {
          console.log( 'moving to translation' );

          //Create the RNACodonTable lazily so it will have the right highlighting
          var rnaCodonTable = new RNACodonTable( proteinSynthesisScreenView, translationScaleFactor, {} );
          var title = new Text( 'RNA codon table', new PhetFont( 24 ) );
          proteinSynthesisScreenView.codonTableAccordionBox = new Panel( new VBox( {spacing: 10, children: [rnaCodonTable, title]} ), {
            bottom: sceneSelectionPanel.top - 10 + 139,
            left: 15 + 2000//todo magic numbers
          } );
          worldNode.addChild( proteinSynthesisScreenView.codonTableAccordionBox );

          //Move back the non-coding strand
          nonCodingStrand.forEach( function( baseNode ) {
            //TODO: Move these baseNodes behind the control panels
            worldNode.removeChild( baseNode );
            worldNode.insertChild( worldNode.indexOfChild( nucleusShape ) + 1, baseNode );

            //Move away the non-coding strand when translation starts
            //TODO: var tween and cancel?
            new TWEEN.Tween( { y: baseNode.y} )
              .to( { y: baseNode.originalY}, 1000 )
              .easing( TWEEN.Easing.Cubic.InOut )
              .onUpdate( function() {
                baseNode.y = this.y;
              } )
              .onComplete( function() {
              } )
              .start();
          } );

          proteinSynthesisScreenView.viewProperties.location = 'cytoplasm';
          proteinSynthesisScreenView.codonTableAccordionBox.moveToFront();//move in front of mRNA strands.
        }
        else if ( oldState === 'translation' && state === 'dna' ) {
          proteinSynthesisScreenView.viewProperties.location = 'nucleus';
        }
      } );

      // Add the nucleus label
      var nucleusLabel = new Text( 'Nucleus', {font: new PhetFont( 18 ), top: 10, right: this.layoutBounds.right - 10} );
      this.viewProperties.labelsVisibleProperty.linkAttribute( nucleusLabel, 'visible' );
      worldNode.addChild( nucleusLabel );

      // Add the nucleus label
      var cytoplasmLabel = new Text( 'Cytoplasm', {font: new PhetFont( 18 / translationScaleFactor ), top: 10, left: 2014.974609375} );
      this.viewProperties.labelsVisibleProperty.linkAttribute( cytoplasmLabel, 'visible' );
      worldNode.addChild( cytoplasmLabel );

      //Start in the cytoplasm, for debugging
      if ( window.phetcommon.getQueryParameter( 'translation' ) ) {
        this.viewProperties.state = 'translation';
        this.viewProperties.location = 'cytoplasm';
      }

      //Create random strands
      if ( window.phetcommon.getQueryParameter( 'randomStrand' ) ) {
        (function() {
          var a = function() {return new Adenine( 'deoxyribose' );};
          var t = function() {return new Thymine( 'deoxyribose' );};
          var g = function() {return new Guanine( 'deoxyribose' );};
          var c = function() {return new Cytosine( 'deoxyribose' );};

          var stack = [a, t, g, c];
          for ( var k = 0; k < 60; k++ ) {
            var baseNode = toBaseNode( stack[k % stack.length]() );
            baseNode.setScaleMagnitude( 0.6 );
            var cp = proteinSynthesisScreenView.connectionModel.getConnectionPoints( baseNode );
            var element = Math.floor( Math.random() * cp.length );
            baseNode.setPointingUp( cp[element].up );
            baseNode.setBodyCenter( cp[element].point );
            cp[element].connect();
            worldNode.addChild( baseNode );
          }
        })();
      }

      if ( window.phetcommon.getQueryParameter( 'test' ) ) {
        new TestTRNAConnectionPoints( this ).test();
      }

      if ( window.phetcommon.getQueryParameter( 'testCodonTable' ) ) {

        var c = new RNACodonTable( proteinSynthesisScreenView, translationScaleFactor, {scale: translationScaleFactor} );
        this.addChild( c );
      }
    },
    //Determine where the baseNode can connect.  Must account for bound types, and things that are already bonded.
    //TODO: What if the user is dragging a fragment (2+ pieces) to connect with another fragment (2+ pieces)?
    getConnectionPoints: function( baseNode ) {
      return this.connectionModel.getConnectionPoints( baseNode );
    },

    //Convenience constructor since several ProteinSynthesisScreenView properties are used
    createTRNANode: function( string ) {
      return new TRNANode( string, this, this.viewProperties.baseLabelsVisibleProperty, this.viewProperties.labelsVisibleProperty );
    },

    //Convenience method for creating AUGC
    createMRNABaseNode: function( abbreviation ) {
      var base = abbreviation === 'A' ? new Adenine( 'ribose' ) :
                 abbreviation === 'U' ? new Uracil( 'ribose' ) :
                 abbreviation === 'G' ? new Guanine( 'ribose' ) :
                 abbreviation === 'C' ? new Cytosine( 'ribose' ) :
                 null;
      assert && assert( base !== null );
      return new BaseNode( base, this, this.viewProperties.baseLabelsVisibleProperty, this.viewProperties.labelsVisibleProperty, true, false );
    },

    trnaAttached: function( trnaNode, closestConnectionPoint ) {
      var proteinSynthesisScreenView = this;

      this.attachedTRNANodes.push( trnaNode );

      this.attachedTRNANodes.forEach( function( trnaNode ) {
        //Move the tRNA and mRNA to the left by the length of one codon
        new TWEEN.Tween( { x: trnaNode.x} )
          .to( { x: trnaNode.x - BaseShape.BODY_WIDTH * 3 * BaseNode.fullSize}, 1000 )
          .easing( TWEEN.Easing.Cubic.InOut )
          .onUpdate( function() {
            trnaNode.x = this.x;
          } )
          .onComplete( function() {
            proteinSynthesisScreenView.viewProperties.numAminoAcids = proteinSynthesisScreenView.viewProperties.numAminoAcids + 1;
          } )
          .start();

      } );

      var bottomBaseNodes = this.connectionModel.bottomBaseNodes;
      bottomBaseNodes.forEach( function( baseNode ) {
        //Move the tRNA and mRNA to the left by the length of one codon
        new TWEEN.Tween( { x: baseNode.x} )
          .to( { x: baseNode.x - BaseShape.BODY_WIDTH * 3 * BaseNode.fullSize}, 1000 )
          .easing( TWEEN.Easing.Cubic.InOut )
          .onUpdate( function() {
            baseNode.x = this.x;
          } )
          .onComplete( function() {
          } )
          .start();

      } );
    }
  } );
} );