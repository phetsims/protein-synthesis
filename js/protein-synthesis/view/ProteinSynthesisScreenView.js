// Copyright 2014-2017, University of Colorado Boulder

/**
 * View for the 'ProteinSynthesis' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Adenine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Adenine' );
  var AminoAcidNode = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/AminoAcidNode' );
  var BaseNode = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/BaseNode' );
  var BaseShape = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/BaseShape' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Checkbox = require( 'SUN/Checkbox' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var ConnectionModel = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/ConnectionModel' );
  var Cytosine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Cytosine' );
  var Guanine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Guanine' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var proteinSynthesis = require( 'PROTEIN_SYNTHESIS/proteinSynthesis' );
  var ProteinSynthesisQueryParameters = require( 'PROTEIN_SYNTHESIS/protein-synthesis/ProteinSynthesisQueryParameters' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RibosomeNode = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/RibosomeNode' );
  var RNACodonTable = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/RNACodonTable' );
  var SceneSelectionPanel = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/SceneSelectionPanel' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var TestTRNAConnectionPoints = require( 'PROTEIN_SYNTHESIS/protein-synthesis/tests/TestTRNAConnectionPoints' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Thymine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Thymine' );
  var TRNANode = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/TRNANode' );
  var Uracil = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Uracil' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  //constants
  var translationScaleFactor = 0.75;

  /**
   * Constructor for the ProteinSynthesisScreenView
   * @constructor
   */
  function ProteinSynthesisScreenView( model ) {
    this.model = model;
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 834, 504 ) } );

    this.baseLabelsVisibleProperty = new Property( true );
    this.labelsVisibleProperty = new Property( false );
    this.stateProperty = new Property( 'dna' ); // [dna,transcription/translation]
    this.locationProperty = new Property( 'nucleus' ); // [nucleus/cytoplasm]
    this.numAminoAcidsProperty = new Property( 0 );

    //TODO: Rewrite resetAll using the normal conventions.
    this.initChildren();
  }

  proteinSynthesis.register( 'ProteinSynthesisScreenView', ProteinSynthesisScreenView );

  return inherit( ScreenView, ProteinSynthesisScreenView, {

    //Normally all of this would be in the constructor.  However, to cope with impending deadlinens resetAll has been implemented
    //by reinitializing the model + view
    initChildren: function() {

      var self = this;

      //Everything that should translate with the camera
      var worldNode = new Node();
      this.worldNode = worldNode;

      this.addChild( worldNode );
      var nucleusShape = new Circle( 1000, {
        fill: '#E2E9F7',
        stroke: 'black',
        lineWidth: 4,
        centerX: this.layoutBounds.centerX,
        centerY: this.layoutBounds.centerY
      } );
      worldNode.addChild( nucleusShape );

      //TODO: While dragging, show a drop shadow

      var resetAllButton = new ResetAllButton( {
        right: this.layoutBounds.maxX - 5,
        bottom: this.layoutBounds.maxY - 5,
        listener: function() {
          self.model.reset();

          self.baseLabelsVisibleProperty.reset();
          self.labelsVisibleProperty.reset();
          self.stateProperty.reset();
          self.locationProperty.reset();
          self.numAminoAcidsProperty.reset();

          self.removeAllChildren();
          self.initChildren();
        }
      } );
      this.addChild( resetAllButton );

      this.attachedTRNANodes = [];

      //Put the dotted line to the top left so students will build left to right and things will fit into the ribosome (which is on the left side of the screen)
      this.dottedLine = new Rectangle( 0, 0, BaseShape.BODY_WIDTH, BaseShape.BODY_HEIGHT, 5, 5, {
        scale: 0.6,
        stroke: 'red',
        lineWidth: 3,
        lineDash: [ 6, 4 ],
        centerY: 150,
        left: 50
      } );
      worldNode.addChild( this.dottedLine );
      var codingStrandLabel = new Text( 'Coding Strand', {
        font: new PhetFont( 18 ),
        left: this.dottedLine.left,
        bottom: this.dottedLine.top - 10
      } );
      this.labelsVisibleProperty.linkAttribute( codingStrandLabel, 'visible' );
      worldNode.addChild( codingStrandLabel );

      //Label the complementary strand, only visible in the "dna" mode
      var complementaryStrandLabel = new Text( 'Complementary Strand', {
        font: new PhetFont( 18 ),
        left: this.dottedLine.left,
        bottom: this.dottedLine.bottom + 150
      } );
      Property.multilink( [ this.labelsVisibleProperty, this.stateProperty ], function( labelsVisible, state ) {
        complementaryStrandLabel.visible = labelsVisible && state === 'dna';
      } );
      worldNode.addChild( complementaryStrandLabel );

      this.connectionModel = new ConnectionModel( this.dottedLine.centerX, this.dottedLine.centerY );
      this.connectionModel.changedEmitter.addListener( function() {
        //If something connected, stop showing the initial target
        self.dottedLine.visible = self.connectionModel.isEmpty;
      } );

      var toBaseNode = function( base ) {
        return new BaseNode( base, self, self.baseLabelsVisibleProperty, self.labelsVisibleProperty, true, false );
      };
      var createBaseNodeStack = function( index, constructor ) {
        var children = [];
        var x = 260;
        var y = 387;
        for ( var i = 0; i < 5; i++ ) {
          var baseNode = toBaseNode( constructor() );
          baseNode.setInitialPosition( x + i * 2 + index * 100, y + i * 2 );
          children.push( baseNode );
        }
        return children;
      };

      var sceneSelectionPanel = new SceneSelectionPanel( this.connectionModel, this.stateProperty, {
        centerX: this.layoutBounds.centerX,
        bottom: this.layoutBounds.bottom - 4
      } );
      this.addChild( sceneSelectionPanel );

      var dnaStacks = [
        createBaseNodeStack( 0, function() {return new Adenine( 'deoxyribose' );} ),
        createBaseNodeStack( 1, function() {return new Thymine( 'deoxyribose' );} ),
        createBaseNodeStack( 2, function() {return new Guanine( 'deoxyribose' );} ),
        createBaseNodeStack( 3, function() {return new Cytosine( 'deoxyribose' );} )
      ];

      var dnaToolbox = new Rectangle( 0, 0, 450, 100, 10, 10, {
        fill: 'white',
        lineWidth: 1,
        stroke: 'black',
        centerX: this.layoutBounds.centerX,
        bottom: sceneSelectionPanel.top - 10
      } );
      dnaToolbox.addChild( new Text( 'DNA', { centerX: 450 / 2, bottom: 100 - 2 } ) );
      worldNode.addChild( dnaToolbox );

      var dnaBases = [];
      var mRNABases = [];
      var i = 0;
      var j = 0;
      for ( i = 0; i < dnaStacks.length; i++ ) {
        var dnaStack = dnaStacks[ i ];
        for ( j = 0; j < dnaStack.length; j++ ) {
          worldNode.addChild( dnaStack[ j ] );
          dnaBases.push( dnaStack[ j ] );
        }
      }

      var mRNAStacks = [
        createBaseNodeStack( 0, function() {return new Adenine( 'ribose' );} ),
        createBaseNodeStack( 1, function() {return new Uracil( 'ribose' );} ),
        createBaseNodeStack( 2, function() {return new Guanine( 'ribose' );} ),
        createBaseNodeStack( 3, function() {return new Cytosine( 'ribose' );} )
      ];

      var mRNAToolbox = new Rectangle( 0, 0, 450, 100, 10, 10, {
        fill: 'white',
        lineWidth: 1,
        stroke: 'black',
        centerX: this.layoutBounds.centerX,
        bottom: sceneSelectionPanel.top - 10
      } );
      mRNAToolbox.addChild( new Text( 'mRNA', { centerX: 450 / 2, bottom: 100 - 2 } ) );
      worldNode.addChild( mRNAToolbox );

      for ( i = 0; i < mRNAStacks.length; i++ ) {
        var mRNAStack = mRNAStacks[ i ];
        for ( j = 0; j < mRNAStack.length; j++ ) {
          var mRNABase = mRNAStack[ j ];
          mRNABases.push( mRNABase );
          worldNode.addChild( mRNABase );
        }
      }

      this.stateProperty.link( function( state ) {
        dnaToolbox.visible = state === 'dna';
        mRNAToolbox.visible = state === 'transcription' || state === 'translation';

        var i = 0;
        var base = null;

        //Any mRNA/DNA not in the connection model must be hidden too.
        if ( state === 'dna' ) {
          for ( i = 0; i < mRNABases.length; i++ ) {
            base = mRNABases[ i ];
            if ( !self.connectionModel.contains( base ) ) {
              base.visible = false;
            }
          }
        }
        else {
          for ( i = 0; i < mRNABases.length; i++ ) {
            base = mRNABases[ i ];
            base.visible = true;
          }

          // When switching away from dna mode, hide any of the DNA nucleotides that are not connected in the play area, see #4
          for ( i = 0; i < dnaBases.length; i++ ) {
            var missingFromConnectionModel = !self.connectionModel.contains( dnaBases[ i ] );

            // Also, leave the dna nucleotide visible if it was bubbled out for transcription, see #16
            if ( missingFromConnectionModel && !dnaBases[ i ].bubbledOutForTranscription ) {
              dnaBases[ i ].visible = false;
            }
          }

          // When in translation, make the mRNA undraggable, fixes #6
          if ( state === 'translation' ) {
            for ( i = 0; i < mRNABases.length; i++ ) {
              base = mRNABases[ i ];
              base.pickable = false;
            }
          }
        }
      } );

      var labelsCheckbox = new Checkbox( new Text( 'Labels', { font: new PhetFont( 17 ) } ), this.labelsVisibleProperty, {
        left: this.layoutBounds.left + 5,
        centerY: sceneSelectionPanel.centerY
      } );
      this.addChild( labelsCheckbox );

      var ribosomeNode = new RibosomeNode( this.labelsVisibleProperty );
      ribosomeNode.centerX = 2725;
      worldNode.addChild( ribosomeNode );

      this.stateProperty.link( function( state, oldState ) {
        if ( state === 'translation' && oldState === 'transcription' ) {

          new TWEEN.Tween( { progress: 0, x: 0 } )
            .to( { progress: 1, x: 2000 }, 4000 )
            .easing( TWEEN.Easing.Cubic.InOut )
            .onUpdate( function() {
              self.worldNode.x = this.x;
              var scale = Util.linear( 0, 1, 1, translationScaleFactor, this.progress );
              worldNode.x = -this.progress * 2000 * scale;
              //bring any mRNA out of the nucleus to the cytoplasm.
              worldNode.setScaleMagnitude( scale );
            } )
            .start( phet.joist.elapsedTime );

          var mrnaNodes = self.connectionModel.bottomBaseNodes;

          //Leftmost mRNA node should be parked directly in the ribosome
          var leftmostMRNANodeX = _.minBy( mrnaNodes, function( mrnaNode ) {return mrnaNode.left;} ).x;
          self.distanceMRNATranslated = 2000 + 414.2696199129823 - leftmostMRNANodeX + 250.8; //TODO: So much magics

          mrnaNodes.forEach( function( baseNode ) {
            new TWEEN.Tween( { x: baseNode.x } )
              .to( { x: baseNode.x + self.distanceMRNATranslated }, 3800 )
              .easing( TWEEN.Easing.Cubic.InOut )
              .onUpdate( function() {
                baseNode.x = this.x;
              } )
              .start( phet.joist.elapsedTime );
          } );
        }
      } );

      var nonCodingStrand = [];
      this.stateProperty.link( function( state, oldState ) {
        if ( oldState === 'dna' && state === 'transcription' ) {
          nonCodingStrand.length = 0;

          //find all the base nodes on the bottom, move to the back and animate them south.
          var bottomBaseNodes = self.connectionModel.bottomBaseNodes;
          bottomBaseNodes.forEach( function( baseNode ) {

            baseNode.originalY = baseNode.y;
            //TODO: Move these baseNodes behind the control panels
            worldNode.hasChild( baseNode ) && worldNode.removeChild( baseNode );
            worldNode.insertChild( worldNode.indexOfChild( nucleusShape ) + 1, baseNode );

            self.connectionModel.remove( baseNode );

            // Mark the node so it will return before going to transcription
            baseNode.bubbledOutForTranscription = true;

            //Move away the non-coding strand when translation starts
            //TODO: var tween and cancel?
            new TWEEN.Tween( { y: baseNode.y } )
              .to( { y: baseNode.y + 500 }, 1000 )
              .easing( TWEEN.Easing.Cubic.InOut )
              .onUpdate( function() {
                baseNode.y = this.y;
              } )
              .onComplete( function() {
                nonCodingStrand.push( baseNode );
              } )
              .start( phet.joist.elapsedTime );
          } );
        }

        //TODO: Much duplicated code with the above
        else if ( oldState === 'transcription' && state === 'translation' ) {

          //Create the RNACodonTable lazily so it will have the right highlighting
          var rnaCodonTable = new RNACodonTable( self, translationScaleFactor, {} );
          var title = new Text( 'RNA codon table', { font: new PhetFont( 24 ) } );
          self.codonTableAccordionBox = new Panel( new VBox( {
            spacing: 10,
            children: [ rnaCodonTable, title ]
          } ), {
            bottom: sceneSelectionPanel.top - 10 + 139,
            left: 15 + 2000//todo magic numbers
          } );
          worldNode.addChild( self.codonTableAccordionBox );

          //Move back the non-coding strand
          nonCodingStrand.forEach( function( baseNode ) {
            //TODO: Move these baseNodes behind the control panels
            worldNode.removeChild( baseNode );
            worldNode.insertChild( worldNode.indexOfChild( nucleusShape ) + 1, baseNode );

            //Move away the non-coding strand when translation starts
            //TODO: var tween and cancel?
            new TWEEN.Tween( { y: baseNode.y } )
              .to( { y: baseNode.originalY }, 1000 )
              .easing( TWEEN.Easing.Cubic.InOut )
              .onUpdate( function() {
                baseNode.y = this.y;
              } )
              .onComplete( function() {
              } )
              .start( phet.joist.elapsedTime );
          } );

          self.locationProperty.value = 'cytoplasm';
          self.codonTableAccordionBox.moveToFront();//move in front of mRNA strands.
        }
        else if ( oldState === 'translation' && state === 'dna' ) {
          self.locationProperty.value = 'nucleus';
        }
      } );

      // Add the nucleus label
      var nucleusLabel = new Text( 'Nucleus', {
        font: new PhetFont( 18 ),
        top: 10,
        right: this.layoutBounds.right - 10
      } );
      this.labelsVisibleProperty.linkAttribute( nucleusLabel, 'visible' );
      worldNode.addChild( nucleusLabel );

      // Add the nucleus label
      var cytoplasmLabel = new Text( 'Cytoplasm', {
        font: new PhetFont( 18 / translationScaleFactor ),
        top: 10,
        left: 2014.974609375
      } );
      this.labelsVisibleProperty.linkAttribute( cytoplasmLabel, 'visible' );
      worldNode.addChild( cytoplasmLabel );

      //Start in the cytoplasm, for debugging
      if ( ProteinSynthesisQueryParameters.translation ) {
        this.stateProperty.value = 'translation';
        this.locationProperty.value = 'cytoplasm';
      }

      //Create random strands
      if ( ProteinSynthesisQueryParameters.randomStrand ) {
        (function() {
          var a = function() {return new Adenine( 'deoxyribose' );};
          var t = function() {return new Thymine( 'deoxyribose' );};
          var g = function() {return new Guanine( 'deoxyribose' );};
          var c = function() {return new Cytosine( 'deoxyribose' );};

          var stack = [ a, t, g, c ];
          for ( var k = 0; k < 60; k++ ) {
            var baseNode = toBaseNode( stack[ k % stack.length ]() );
            baseNode.setScaleMagnitude( 0.6 );
            var cp = self.connectionModel.getConnectionPoints( baseNode );
            var element = Math.floor( Math.random() * cp.length );
            baseNode.setPointingUp( cp[ element ].up );
            baseNode.setBodyCenter( cp[ element ].point );
            cp[ element ].connect();
            worldNode.addChild( baseNode );
          }
        })();
      }

      if ( ProteinSynthesisQueryParameters.test ) {
        new TestTRNAConnectionPoints( this ).test();
      }

      if ( ProteinSynthesisQueryParameters.testCodonTable ) {

        var c = new RNACodonTable( self, translationScaleFactor, { scale: translationScaleFactor } );
        this.addChild( c );
      }

      if ( ProteinSynthesisQueryParameters.aminoAcids ) {
        var table = RNACodonTable.table;
        var children = _.keys( table ).map( function( element ) {
          return new AminoAcidNode( table[ element ], self.labelsVisibleProperty ).mutate( { scale: 0.25 } );
        } );
        var hbox = new HBox( { children: children, top: 100, align: 'bottom' } );
        this.addChild( hbox );
      }
    },
    //Determine where the baseNode can connect.  Must account for bound types, and things that are already bonded.
    //TODO: What if the user is dragging a fragment (2+ pieces) to connect with another fragment (2+ pieces)?
    getConnectionPoints: function( baseNode ) {
      return this.connectionModel.getConnectionPoints( baseNode );
    },

    //Convenience constructor since several ProteinSynthesisScreenView properties are used
    //@param {string} string - the mRNA codon triplet
    createTRNANode: function( tRNATriplet, mRNATriplet ) {
      return new TRNANode( tRNATriplet, mRNATriplet, this, this.baseLabelsVisibleProperty, this.labelsVisibleProperty );
    },

    //Convenience method for creating AUGC
    createMRNABaseNode: function( abbreviation ) {
      var base = abbreviation === 'A' ? new Adenine( 'ribose' ) :
                 abbreviation === 'U' ? new Uracil( 'ribose' ) :
                 abbreviation === 'G' ? new Guanine( 'ribose' ) :
                 abbreviation === 'C' ? new Cytosine( 'ribose' ) :
                 null;
      assert && assert( base !== null );
      return new BaseNode( base, this, this.baseLabelsVisibleProperty, this.labelsVisibleProperty, true, false );
    },

    //After the tRNAs have been translated out of the ribosome, detach any that can be detached
    detachTRNAs: function() {
      //The rule for whether it can be detached from the AA:
      //For each tRNA: If its AA has connected to something to the right, or no more codons coming => detach

      var numCompleteCodons = Math.floor( this.connectionModel.sizeBottom / 3 );

      for ( var i = 0; i < this.attachedTRNANodes.length; i++ ) {
        var trnaNode = this.attachedTRNANodes[ i ];

        var aaConnectedToTheRight = i < this.numAminoAcidsProperty.value - 1;
        var lastCodon = i === numCompleteCodons - 1;

        if ( aaConnectedToTheRight || lastCodon ) {
          trnaNode.detachTRNAFromAminoAcid();//TODO: This gets called multiple times, but shouldn't
        }
      }
    },

    trnaAttached: function( trnaNode, closestConnectionPoint ) {

      // When a tRNA is attached to the peptide chain, it should no longer be individually draggable, see #7
      trnaNode.pickable = false;
      var self = this;

      this.attachedTRNANodes.push( trnaNode );

      var numToTranslate = this.attachedTRNANodes.length;
      var numTranslated = 0;

      self.connectionModel.numberOfTranslationSteps++;

      this.attachedTRNANodes.forEach( function( trnaNode ) {

        //Move the tRNA and mRNA to the left by the length of one codon
        new TWEEN.Tween( { x: trnaNode.x } )
          .to( { x: trnaNode.x - BaseShape.BODY_WIDTH * 3 * BaseNode.fullSize }, 1000 )
          .easing( TWEEN.Easing.Cubic.InOut )
          .onUpdate( function() {
            trnaNode.x = this.x;
          } )
          .onComplete( function() {
            numTranslated++;
            if ( numTranslated === numToTranslate ) {
              self.numAminoAcidsProperty.value = self.numAminoAcidsProperty.value + 1;
              self.detachTRNAs();
            }
          } )
          .start( phet.joist.elapsedTime );
      } );

      var bottomBaseNodes = this.connectionModel.bottomBaseNodes;
      bottomBaseNodes.forEach( function( baseNode ) {
        //Move the tRNA and mRNA to the left by the length of one codon
        new TWEEN.Tween( { x: baseNode.x } )
          .to( { x: baseNode.x - BaseShape.BODY_WIDTH * 3 * BaseNode.fullSize }, 1000 )
          .easing( TWEEN.Easing.Cubic.InOut )
          .onUpdate( function() {
            baseNode.x = this.x;
          } )
          .onComplete( function() {
          } )
          .start( phet.joist.elapsedTime );
      } );
    }
  } );
} );