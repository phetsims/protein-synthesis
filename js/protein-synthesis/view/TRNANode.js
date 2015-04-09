// Copyright 2002-2014, University of Colorado Boulder

/**
 * tRNANode, with tRNA (including codon triplet) and associated protein
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Adenine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Adenine' );
  var Guanine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Guanine' );
  var Cytosine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Cytosine' );
  var Uracil = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Uracil' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BaseNode = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/BaseNode' );
  var Shape = require( 'KITE/Shape' );
  var BaseShape = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/BaseShape' );
  var AminoAcidNode = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/AminoAcidNode' );
  var RNACodonTable = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/RNACodonTable' );

  /**
   * Constructor for the TRNANode
   * @constructor
   */
  function TRNANode( tRNATriplet, mRNATriplet, screenView, baseLabelsVisibleProperty, labelsVisibleProperty ) {

    this.screenView = screenView;

    var trnaNode = this;
    var children = [];

    var aminoAcidNode = new AminoAcidNode( RNACodonTable.table[ tRNATriplet ], labelsVisibleProperty );

//    children.push( aminoAcidNode );
    var orange = '#f9b664';
    var trnaBody = new Path( new Shape().moveTo( -40, 35 ).lineToRelative( 15, 40 ).lineToRelative( 150, 0 ).lineToRelative( 15, -40 ).close(), {
      fill: orange,
      stroke: 'black',
      lineWidth: 1,
      rotation: Math.PI,
      left: -30 + 3
    } );
    children.push( trnaBody );
    aminoAcidNode.centerX = trnaBody.centerX;
    aminoAcidNode.bottom = trnaBody.top;

    this.baseNodes = [];
    for ( var i = 0; i < mRNATriplet.length; i++ ) {
      var char = mRNATriplet.charAt( i );
      var baseNode = new BaseNode( char === 'A' ? new Adenine( 'ribose' ) :
                                   char === 'U' ? new Uracil( 'ribose' ) :
                                   char === 'G' ? new Guanine( 'ribose' ) :
                                   new Cytosine( 'ribose' ),
        screenView, baseLabelsVisibleProperty, labelsVisibleProperty, false, true );

      //Start as pointing down (as in many textbooks).  TODO: should we allow these to flip vertically?
      baseNode.base.angle = Math.PI;
      baseNode.setScaleMagnitude( BaseNode.fullSize );
      baseNode.translate( 140 * i - 43, 43 );
      children.push( baseNode );
      this.baseNodes.push( baseNode );
    }

    children.push( new Text( 'tRNA', { center: trnaBody.center } ) );

    this.detachableComponents = new Node( { children: children } );
    Node.call( this, {
      children: [ aminoAcidNode, this.detachableComponents ],
      scale: 1,
      pickable: true,
      cursor: 'pointer'
    } );

    this.baseLabelsVisibleProperty = baseLabelsVisibleProperty;
    this.labelsVisibleProperty = labelsVisibleProperty;

//    //TODO: Use MovableDragHandler to constrain bounds?
    this.addInputListener( new SimpleDragHandler( {
      start: function( event, trail ) {
        trnaNode.drag( event, trail );
      },
      drag: function( event, trail ) {
        trnaNode.drag( event, trail );
      },
      end: function( event, trail ) {
        trnaNode.end( event, trail );
      }
    } ) );
  }

  return inherit( Node, TRNANode, {
    getTRNANodeScale: function() {
      var scaleMag = this.getScaleVector();
      return scaleMag.x;
    },

    //Set the location of the tRNA.  Must be relative to top/left so that different widths & heights will translate the same
    setBodyCenter: function( bodyCenter ) {
      var scale = this.getTRNANodeScale();

      //Have to set x/y here instead of top/left/bottom/right because each tRNA has different dimensions.
      this.x = bodyCenter.x - 71 * scale;
      this.y = bodyCenter.y - 55 * scale;
    },
    start: function( event, trail ) {
      this.drag( event, trail );
    },
    drag: function( event, trail ) {
      var trnaNode = this;
      var screenView = this.screenView;

      var proposedBodyCenter = screenView.worldNode.globalToLocalPoint( event.pointer.point );

      var snapped = false;
      //TODO: make sure types are compatible (AT, GC)
      var connectionPoints = screenView.connectionModel.getConnectionPointsForTRNA( screenView, trnaNode );
      if ( connectionPoints.length > 0 ) {
        var closestConnectionPoint = _.min( connectionPoints, function( connectionPoint ) {return connectionPoint.point.distance( proposedBodyCenter );} );
        var newPoint = closestConnectionPoint.point.plusXY( 85 - screenView.viewProperties.numAminoAcids * BaseShape.BODY_WIDTH * 3 * BaseNode.fullSize, 60 );
        var distance = newPoint.distance( proposedBodyCenter );
        console.log( 'distance', distance );
        if ( distance < 30 ) {

          //Close enough for connection.
          console.log( 'close' );

          trnaNode.setBodyCenter( newPoint );
          snapped = true;
        }
      }
      if ( !snapped ) {
        trnaNode.setBodyCenter( proposedBodyCenter );
      }
    },
    end: function( event, trail ) {
      //if it did not connect, then fly back to the RNACodonTable, where it originated

      var trnaNode = this;
      var screenView = this.screenView;

      var proposedBodyCenter = screenView.worldNode.globalToLocalPoint( event.pointer.point );

      var snapped = false;
      //TODO: make sure types are compatible (AT, GC)
      var connectionPoints = screenView.connectionModel.getConnectionPointsForTRNA( screenView, trnaNode );
      if ( connectionPoints.length > 0 ) {
        var closestConnectionPoint = _.min( connectionPoints, function( connectionPoint ) {return connectionPoint.point.distance( proposedBodyCenter );} );
        var newPoint = closestConnectionPoint.point.plusXY( 85 - screenView.viewProperties.numAminoAcids * BaseShape.BODY_WIDTH * 3 * BaseNode.fullSize, 60 );
        var distance = newPoint.distance( proposedBodyCenter );
        console.log( 'distance', distance );
        if ( distance < 30 ) {

          //Close enough for connection.
          console.log( 'close' );

          trnaNode.setBodyCenter( newPoint );
          snapped = true;
          screenView.trnaAttached( trnaNode, closestConnectionPoint );
        }
      }
      if ( !snapped ) {
        var initScale = trnaNode.getScaleVector().x;
        new TWEEN.Tween( { x: trnaNode.x, y: trnaNode.y, scale: initScale } )
          .to( { x: trnaNode.initialX, y: trnaNode.initialY, scale: 0.2 }, 700 )
          .easing( TWEEN.Easing.Cubic.InOut )
          .onUpdate( function() {
            trnaNode.setScaleMagnitude( this.scale );
            trnaNode.setTranslation( this.x, this.y );
          } )
          .onComplete( function() {
            trnaNode.detach();
          } )
          .start();
      }
    },

    // After moving out of the ribosome, the tRNA body should float away
    detachTRNAFromAminoAcid: function() {

      var detachableComponents = this.detachableComponents;
      new TWEEN.Tween( { x: detachableComponents.x, y: detachableComponents.y } )
        .to( { x: detachableComponents.x, y: detachableComponents.y + 2000 }, 700 )
        .easing( TWEEN.Easing.Cubic.InOut )
        .onUpdate( function() {
          detachableComponents.setTranslation( this.x, this.y );
        } )
        .onComplete( function() {
          detachableComponents.detach();
        } )
        .start();
    }
  } );
} );