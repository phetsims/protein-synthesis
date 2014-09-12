//  Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'ProteinSynthesis' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
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

    this.addChild( new ResetAllButton( { right: this.layoutBounds.maxX - 10, bottom: this.layoutBounds.maxY - 10} ) );

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

    this.baseNodes = [];
    this.hydrogenBonds = [];
    this.backboneBonds = [];

    var toBaseNode = function( base ) {
      var baseNode = new BaseNode( base, proteinSynthesisScreenView, proteinSynthesisScreenView.viewProperties.baseLabelsVisibleProperty, proteinSynthesisScreenView.viewProperties.labelsVisibleProperty, true );
      proteinSynthesisScreenView.baseNodes.push( baseNode );
      return baseNode;
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

//      proteinSynthesisScreenView.viewProperties.nucleusToCytoplasmProperty.value = state === 'translation' ? 1 : 0;
    } );

    this.viewProperties.locationProperty.link( function( location ) {
      var cytoplasm = (location === 'cytoplasm');
      if ( cytoplasm && proteinSynthesisScreenView.viewProperties.nucleusToCytoplasm !== 1 || !cytoplasm && proteinSynthesisScreenView.viewProperties.nucleusToCytoplasm !== 0 ) {

        //TODO: var tween and cancel?
        new TWEEN.Tween( { x: proteinSynthesisScreenView.viewProperties.nucleusToCytoplasm} )
          .to( { x: cytoplasm ? 1 : 0 }, 2000 )
          .easing( TWEEN.Easing.Cubic.InOut )
          .onUpdate( function() {
            proteinSynthesisScreenView.viewProperties.nucleusToCytoplasmProperty.set( this.x );
          } )
          .start();
      }
    } );

//    this.addChild( rnaCarousel );

    var structureCheckBox = new CheckBox( new Text( 'Labels', new PhetFont( 17 ) ), this.viewProperties.labelsVisibleProperty, {right: this.layoutBounds.right - 10, bottom: this.layoutBounds.bottom - 70} );
    this.addChild( structureCheckBox );

//    var choices = ['U', 'C', 'A', 'G'];
//    var index = 0;
//    var previous = null;
//    for ( var i = 0; i < choices.length; i++ ) {
//      var choice1 = choices[i];
//      for ( var j = 0; j < choices.length; j++ ) {
//        var choice2 = choices[j];
//        for ( var k = 0; k < choices.length; k++ ) {
//          var choice3 = choices[k];
//          var string = choice1 + choice2 + choice3;
//          var codon = new TRNANode( string, this, viewProperties.baseLabelsVisibleProperty, viewProperties.labelsVisibleProperty );
//          codon.left = 0;
//          codon.top = previous ? previous.bottom + 2 : this.layoutBounds.top;
//          previous = codon;
//          this.addChild( codon );
//
//          index++;
//        }
//      }
//    }

    var ribosomeNode = new RibosomeNode();
    this.addChild( ribosomeNode );

    this.codonTableAccordionBox = new AccordionBox( new RNACodonTable( this, {} ), {
      titleNode: new Text( 'RNA codon table', new PhetFont( 18 ) ),
      right: this.layoutBounds.right,
      top: this.layoutBounds.top
    } );
    this.addChild( this.codonTableAccordionBox );

    this.viewProperties.nucleusToCytoplasmProperty.link( function( nucleusToCytoplasm ) {
      nucleusShape.centerX = proteinSynthesisScreenView.layoutBounds.centerX - nucleusToCytoplasm * 2000;
//      dnaCarousel.centerX = proteinSynthesisScreenView.layoutBounds.centerX - nucleusToCytoplasm * 2000;
//      rnaCarousel.centerX = proteinSynthesisScreenView.layoutBounds.centerX - nucleusToCytoplasm * 2000;
      proteinSynthesisScreenView.codonTableAccordionBox.right = proteinSynthesisScreenView.layoutBounds.right - nucleusToCytoplasm * 2000 + 2000;
      ribosomeNode.left = -nucleusToCytoplasm * 2000 + 2000 + 120;
    } );

    this.viewProperties.stateProperty.link( function( state, oldState ) {
      if ( oldState === 'dna' && state === 'transcription' ) {
        console.log( 'imagine the strands separating' );

        //find all the base nodes on the bottom, move to the back and animate them south.
        var bottomBaseNodes = proteinSynthesisScreenView.connectionModel.bottomBaseNodes;
        bottomBaseNodes.forEach( function( baseNode ) {

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
              proteinSynthesisScreenView.removeChild( baseNode )
            } )
            .start();
        } );
      }

      //TODO: Much duplicated code with the above
      else if ( oldState === 'transcription' && state === 'translation' ) {
        console.log( 'imagine the strands separating' );

        //find all the base nodes on the top, move to the back and animate them south.
        var topBaseNodes = proteinSynthesisScreenView.connectionModel.topBaseNodes;
        topBaseNodes.forEach( function( baseNode ) {

          //TODO: Move these baseNodes behind the control panels
          proteinSynthesisScreenView.removeChild( baseNode );
          proteinSynthesisScreenView.insertChild( proteinSynthesisScreenView.indexOfChild( nucleusShape ) + 1, baseNode );

          proteinSynthesisScreenView.connectionModel.remove( baseNode );

          //Move away the non-coding strand when translation starts
          //TODO: var tween and cancel?
          new TWEEN.Tween( { y: baseNode.y} )
            .to( { y: baseNode.y - 500}, 1000 )
            .easing( TWEEN.Easing.Cubic.InOut )
            .onUpdate( function() {
              baseNode.y = this.y;
            } )
            .onComplete( function() {
              proteinSynthesisScreenView.removeChild( baseNode );
              proteinSynthesisScreenView.viewProperties.location = 'cytoplasm';
            } )
            .start();
        } );
        proteinSynthesisScreenView.codonTableAccordionBox.moveToFront();//move in front of mRNA strands.
      }
      else if ( oldState === 'translation' && state === 'dna' ) {
        proteinSynthesisScreenView.viewProperties.location = 'nucleus';
      }
    } );

    //Start in the cytoplasm, for debuggnig
    //TODO: Remove this, for debugging
//    this.viewProperties.state = 'translation';
//    this.viewProperties.location = 'cytoplasm';
  }

  return inherit( ScreenView, ProteinSynthesisView, {
    baseNodeDropped: function( baseNode ) {
      var proteinSynthesisScreenView = this;
      //if it was close to another base, snap to it and bond.  maybe show the bond line as gray instead of black+black?

      for ( var i = 0; i < proteinSynthesisScreenView.baseNodes.length; i++ ) {
        var base = proteinSynthesisScreenView.baseNodes[i];

        //Just to the left of an open base

        //TODO: Factor out magic number 140, the width of the body shape (See Base.js)

        //To the left of a base
        if ( base !== baseNode && isCloseTo( base.centerX - baseNode.centerX, 140, 10 ) && isCloseTo( base.bottom, baseNode.bottom, 10 ) ) {
          baseNode.centerX = base.centerX - 140;
          baseNode.bottom = base.bottom;
          break;
        }
        //To the right of a base
        else if ( base !== baseNode && isCloseTo( base.centerX - baseNode.centerX, -140, 10 ) && isCloseTo( base.bottom, baseNode.bottom, 10 ) ) {
          baseNode.centerX = base.centerX + 140;
          baseNode.bottom = base.bottom;
          break;
        }
      }
    },

    //Determine where the baseNode can connect.  Must account for bound types, and things that are already bonded.
    //TODO: What if the user is dragging a fragment (2+ pieces) to connect with another fragment (2+ pieces)?
    getConnectionPoints: function( baseNode ) {
      return this.connectionModel.getConnectionPoints( baseNode );

//      for ( var i = 0; i < this.baseNodes.length; i++ ) {
//        var baseNode = this.baseNodes[i];
//
//        //Make sure it wasn't in carousel
//        if ( baseNode !== originBaseNode && !baseNode.inCarousel ) {
//          //find any unbonded points of attachment on it.
//
//          //is it hydrogen bonded?
//          if ( !this.isHydrogenBonded( baseNode ) ) {
//
//            var verticalSeparation = 100 + BaseShape.TOP_CONNECTOR_HEIGHT * 2;
//
//            if ( baseNode.base.canHydrogenBond( originBaseNode.base ) ) {
//              //Handle up/down
//              if ( baseNode.pointingUp ) {
//                connectionPoints.push( {type: 'hydrogen', baseNode: baseNode, bodyCenter: baseNode.getBodyCenter().plusXY( 0, -verticalSeparation * originBaseNode.getBaseNodeScale() )} );
//              }
//              else {
//                connectionPoints.push( {type: 'hydrogen', baseNode: baseNode, bodyCenter: baseNode.getBodyCenter().plusXY( 0, +verticalSeparation * originBaseNode.getBaseNodeScale() )} );
//              }
//            }
//          }
//
//          if ( !this.isRightSideBonded( baseNode ) ) {
//            connectionPoints.push( {type: 'right', baseNode: baseNode, bodyCenter: baseNode.getBodyCenter().plusXY( 140 * originBaseNode.getBaseNodeScale(), 0 )} );
//          }
//          if ( !this.isLeftSideBonded( baseNode ) ) {
//            connectionPoints.push( {type: 'left', baseNode: baseNode, bodyCenter: baseNode.getBodyCenter().plusXY( -140 * originBaseNode.getBaseNodeScale(), 0 )} );
//          }
//        }
//      }
//      return connectionPoints;
    },
    isHydrogenBonded: function( baseNode ) {
      for ( var j = 0; j < this.hydrogenBonds.length; j++ ) {
        if ( this.hydrogenBonds[j].contains( baseNode ) ) {
          return true;
        }
      }
      return false;
    },
    isRightSideBonded: function( baseNode ) {
      for ( var j = 0; j < this.backboneBonds.length; j++ ) {
        var bond = this.backboneBonds[j];
        //If the left side of the bond matches the node, then the node's right side is unavailable
        if ( bond.leftBaseNode === baseNode ) {
          return true;
        }
      }
      return false;
    },
    isLeftSideBonded: function( baseNode ) {
      for ( var j = 0; j < this.backboneBonds.length; j++ ) {
        var bond = this.backboneBonds[j];
        if ( bond.rightBaseNode === baseNode ) {
          return true;
        }
      }
      return false;
    },
    addBond: function( baseNode, connectionPoint ) {
      if ( connectionPoint.type === 'hydrogen' ) {
        //TODO: Fix upside down if necessary
        this.hydrogenBonds.push( new HydrogenBond( baseNode, connectionPoint.baseNode ) );
      }
      else {
        if ( baseNode.base.angle === 0 ) {
          this.backboneBonds.push( new BackboneBond( connectionPoint.baseNode, baseNode ) );
        }
        else {
          this.backboneBonds.push( new BackboneBond( baseNode, connectionPoint.baseNode ) );
        }
      }
//      screenView.addHydrogenBond( baseNode, closestConnectionPoint );
//      screenView.addBackboneBond( baseNode, closestConnectionPoint );
    }
//    addHydrogenBond: function() {},
//    addBackboneBond: function() {}
  } );
} );