//  Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'ProteinSynthesis' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
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
  var ConnectionPoint = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/ConnectionPoint' );
  var Panel = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/Panel' );
  var HydrogenBond = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/HydrogenBond' );
  var BackboneBond = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/BackboneBond' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BaseShape = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/BaseShape' );
  var PropertySet = require( 'AXON/PropertySet' );
  var CheckBox = require( 'SUN/CheckBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var RNACodonTable = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/RNACodonTable' );
  var SceneSelectionPanel = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/SceneSelectionPanel' );
  var AccordionBox = require( 'SUN/AccordionBox' );
  var RibosomeNode = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/RibosomeNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );
  var ConnectionModel = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/ConnectionModel' );

  var isCloseTo = function( x, y, delta ) {
    return Math.abs( x - y ) <= delta;
  };

  /**
   * Constructor for the ProteinSynthesisView
   * @constructor
   */
  function ProteinSynthesisView( model ) {

    var proteinSynthesisScreenView = this;

    ScreenView.call( this, {renderer: 'svg', layoutBounds: ScreenView.UPDATED_LAYOUT_BOUNDS.copy()} );

    var nucleusShape = new Circle( 1000, {fill: '#E2E9F7', stroke: 'black', lineWidth: 4, centerX: this.layoutBounds.centerX, centerY: this.layoutBounds.centerY} );
    this.addChild( nucleusShape );

    //TODO: While dragging, show a drop shadow

    this.addChild( new ResetAllButton( {
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10,
      listener: function() {
        model.reset();
        proteinSynthesisScreenView.viewProperties.reset();
      }
    } ) );

    this.viewProperties = new PropertySet( {
      baseLabelsVisible: true,
      labelsVisible: true,
      nucleusToCytoplasm: 0,
      state: 'dna',//[dna,transcription/translation]
      location: 'nucleus' // [nucleus/cytoplasm]
    } );

    //Put the dotted line to the top left so students will build left to right and things will fit into the ribosome (which is on the left side of the screen)
    this.dottedLine = new Rectangle( 0, 0, BaseShape.BODY_WIDTH, BaseShape.BODY_HEIGHT, 5, 5, {scale: 0.6, stroke: 'red', lineWidth: 3, lineDash: [6, 4], centerY: 150, centerX: this.layoutBounds.width / 4 + 30} );
    this.addChild( this.dottedLine );
    var codingStrandLabel = new Text( 'Coding Strand', {font: new PhetFont( 18 ), left: this.dottedLine.left, bottom: this.dottedLine.top - 10} );
    this.viewProperties.labelsVisibleProperty.linkAttribute( codingStrandLabel, 'visible' );
    this.addChild( codingStrandLabel );

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
    this.addChild( dnaToolbox );

    var dnaBases = [];
    var mRNABases = [];
    for ( var i = 0; i < dnaStacks.length; i++ ) {
      var dnaStack = dnaStacks[i];
      for ( var j = 0; j < dnaStack.length; j++ ) {
        this.addChild( dnaStack[j] );
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
    this.addChild( mRNAToolbox );

    for ( i = 0; i < mRNAStacks.length; i++ ) {
      var mRNAStack = mRNAStacks[i];
      for ( j = 0; j < mRNAStack.length; j++ ) {
        var mRNABase = mRNAStack[j];
        mRNABases.push( mRNABase );
        this.addChild( mRNABase );
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

    this.viewProperties.locationProperty.link( function( location ) {
      var cytoplasm = (location === 'cytoplasm');
      if ( cytoplasm && proteinSynthesisScreenView.viewProperties.nucleusToCytoplasm !== 1 || !cytoplasm && proteinSynthesisScreenView.viewProperties.nucleusToCytoplasm !== 0 ) {

        //TODO: var tween and cancel?
        new TWEEN.Tween( { x: proteinSynthesisScreenView.viewProperties.nucleusToCytoplasm} )
          .to( { x: cytoplasm ? 1 : 0 }, 4000 )
          .easing( TWEEN.Easing.Cubic.InOut )
          .onUpdate( function() {
            proteinSynthesisScreenView.viewProperties.nucleusToCytoplasmProperty.set( this.x );
          } )
          .start();
      }
    } );

    var structureCheckBox = new CheckBox( new Text( 'Labels', new PhetFont( 17 ) ), this.viewProperties.labelsVisibleProperty, {right: this.layoutBounds.right - 10, bottom: this.layoutBounds.bottom - 70} );
    this.addChild( structureCheckBox );

    var ribosomeNode = new RibosomeNode();
    this.addChild( ribosomeNode );


    this.viewProperties.nucleusToCytoplasmProperty.link( function( nucleusToCytoplasm ) {
      nucleusShape.centerX = proteinSynthesisScreenView.layoutBounds.centerX - nucleusToCytoplasm * 2000;
      dnaToolbox.centerX = proteinSynthesisScreenView.layoutBounds.centerX - nucleusToCytoplasm * 2000;
      mRNAToolbox.centerX = proteinSynthesisScreenView.layoutBounds.centerX - nucleusToCytoplasm * 2000;
      if ( proteinSynthesisScreenView.codonTableAccordionBox ) {
        proteinSynthesisScreenView.codonTableAccordionBox.right = proteinSynthesisScreenView.layoutBounds.right - nucleusToCytoplasm * 2000 + 2000;
      }
      ribosomeNode.left = -nucleusToCytoplasm * 2000 + 2000 + 120;
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
          proteinSynthesisScreenView.removeChild( baseNode );
          proteinSynthesisScreenView.insertChild( proteinSynthesisScreenView.indexOfChild( nucleusShape ) + 1, baseNode );

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
//              proteinSynthesisScreenView.removeChild( baseNode )
            } )
            .start();
        } );
      }

      //TODO: Much duplicated code with the above
      else if ( oldState === 'transcription' && state === 'translation' ) {
        console.log( 'moving to translation' );

        //Create the RNACodonTable lazily so it will have the right highlighting
        proteinSynthesisScreenView.codonTableAccordionBox = new AccordionBox( new RNACodonTable( proteinSynthesisScreenView, {} ), {
          titleNode: new Text( 'RNA codon table', new PhetFont( 18 ) ),
          right: proteinSynthesisScreenView.layoutBounds.right,
          top: proteinSynthesisScreenView.layoutBounds.top
        } );
        proteinSynthesisScreenView.addChild( proteinSynthesisScreenView.codonTableAccordionBox );

        //find all the base nodes on the top, move to the back and animate them south.
        var topBaseNodes = proteinSynthesisScreenView.connectionModel.topBaseNodes;

        //Move back the non-coding strand
        nonCodingStrand.forEach( function( baseNode ) {
          //TODO: Move these baseNodes behind the control panels
          proteinSynthesisScreenView.removeChild( baseNode );
          proteinSynthesisScreenView.insertChild( proteinSynthesisScreenView.indexOfChild( nucleusShape ) + 1, baseNode );

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

        //Rejoin the stands and move them to the left (as the camera pans right)
        topBaseNodes.forEach( function( baseNode ) {
          baseNode.originalX = baseNode.centerX;
        } );
        nonCodingStrand.forEach( function( baseNode ) {
          baseNode.originalX = baseNode.centerX
        } );
        proteinSynthesisScreenView.viewProperties.nucleusToCytoplasmProperty.link( function( nucleusToCytoplasm ) {
          topBaseNodes.forEach( function( baseNode ) {
            baseNode.centerX = baseNode.originalX - nucleusToCytoplasm * 2000;
          } );
          nonCodingStrand.forEach( function( baseNode ) {
            baseNode.centerX = baseNode.originalX - nucleusToCytoplasm * 2000;
          } );
        } );

        proteinSynthesisScreenView.codonTableAccordionBox.moveToFront();//move in front of mRNA strands.
      }
      else if ( oldState === 'translation' && state === 'dna' ) {
        proteinSynthesisScreenView.viewProperties.location = 'nucleus';
      }
    } );

    //Start in the cytoplasm, for debuggnig
    if ( window.phetcommon.getQueryParameter( 'translation' ) ) {
      this.viewProperties.state = 'translation';
      this.viewProperties.location = 'cytoplasm';
    }

    //Create random strands
    if ( window.phetcommon.getQueryParameter( 'randomStrand' ) ) {
      (function() {
        var a = function() {return new Adenine( 'deoxyribose' );};
        var t = function() {return new Thymine( 'deoxyribose' )};
        var g = function() {return new Guanine( 'deoxyribose' )};
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
          proteinSynthesisScreenView.addChild( baseNode );
        }
      })();
    }

    if ( window.phetcommon.getQueryParameter( 'test' ) ) {
      new TestTRNAConnectionPoints( this );
    }
  }

  return inherit( ScreenView, ProteinSynthesisView, {
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
    }
  } );
} );