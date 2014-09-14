//  Copyright 2002-2014, University of Colorado Boulder

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
  var Vector2 = require( 'DOT/Vector2' );
  var Adenine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Adenine' );
  var Guanine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Guanine' );
  var Cytosine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Cytosine' );
  var Uracil = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Uracil' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BaseNode = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/BaseNode' );
  var Shape = require( 'KITE/Shape' );
  var BaseShape = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/BaseShape' );


  /**
   * Constructor for the TRNANode
   * @constructor
   */
  function TRNANode( triplet, screenView, baseLabelsVisibleProperty, labelsVisibleProperty ) {

    this.screenView = screenView;
//    debugger;

    var trnaNode = this;
    var children = [];

//    var aminoAcidNode = new Path( 'M433.18,220.103c0-10.267-8.322-18.59-18.59-18.59c-10.267,0-18.589,8.323-18.589,18.59c0,1.007,0.102,1.987,0.256,2.951c-4.849-1.897-10.12-2.951-15.641-2.951c-5.008,0-9.812,0.866-14.281,2.441c0.105-0.801,0.179-1.612,0.179-2.441c0-10.267-8.323-18.59-18.59-18.59s-18.59,8.323-18.59,18.59c0,9.404,6.989,17.156,16.052,18.396c-4.859,6.96-7.718,15.42-7.718,24.553c0,13.477,6.212,25.498,15.923,33.372c-9.711,7.875-15.923,19.896-15.923,33.373c0,15.658,8.382,29.354,20.901,36.858c-12.519,7.505-20.901,21.201-20.901,36.859c0,23.72,19.229,42.948,42.949,42.948c23.72,0,42.949-19.229,42.949-42.948c0-15.658-8.382-29.354-20.9-36.859c12.519-7.505,20.9-21.2,20.9-36.858c0-13.477-6.212-25.498-15.923-33.373c9.711-7.874,15.923-19.895,15.923-33.372c0-9.077-2.823-17.491-7.629-24.427C425.572,237.933,433.18,229.916,433.18,220.103z',
    var aminoAcidNode = new Path( 'M565.872,442.615H398.377c14.854-6.758,25.188-21.718,25.188-39.102c0-15.658-8.382-29.354-20.9-36.859c12.519-7.505,20.9-21.2,20.9-36.858c0-13.477-6.212-25.498-15.923-33.373c9.711-7.874,15.923-19.895,15.923-33.372c0-9.077-2.823-17.491-7.629-24.427c9.637-0.692,17.244-8.709,17.244-18.522c0-10.267-8.322-18.59-18.59-18.59c-10.267,0-18.589,8.323-18.589,18.59c0,1.007,0.102,1.987,0.256,2.951c-4.849-1.897-10.12-2.951-15.641-2.951c-5.008,0-9.812,0.866-14.281,2.441c0.105-0.801,0.179-1.612,0.179-2.441c0-10.267-8.323-18.59-18.59-18.59s-18.59,8.323-18.59,18.59c0,9.404,6.989,17.156,16.052,18.396c-4.859,6.96-7.718,15.42-7.718,24.553c0,13.477,6.212,25.498,15.923,33.372c-9.711,7.875-15.923,19.896-15.923,33.373c0,15.658,8.382,29.354,20.901,36.858c-12.519,7.505-20.901,21.201-20.901,36.859c0,17.384,10.334,32.344,25.188,39.102H196.641l-28.205,28.205l28.205,28.205h369.231l-25-28.205L565.872,442.615z',
      {fill: 'pink', lineWidth: 2, stroke: 'black', centerX: 0, centerY: 0, scale: 0.68} );

    children.push( aminoAcidNode );
    var orange = '#f9b664';
    var trnaBody = new Path( new Shape().moveTo( -40, 35 ).lineToRelative( 15, 40 ).lineToRelative( 150, 0 ).lineToRelative( 15, -40 ).close(), {fill: orange, stroke: 'black', lineWidth: 1, rotation: Math.PI, left: -30 + 3} );
    children.push( trnaBody );
    aminoAcidNode.centerX = trnaBody.centerX;
    aminoAcidNode.bottom = trnaBody.top;

    this.baseNodes = [];
    for ( var i = 0; i < triplet.length; i++ ) {
      var char = triplet.charAt( i );
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

    children.push( new Text( 'tRNA', {center: trnaBody.center} ) );
    children.push( new Text( 'Glutamic Acid', {center: trnaBody.center.plusXY( 0, -37.5 )} ) );

    Node.call( this, {
      children: children,
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

  return inherit( Path, TRNANode, {
    getTRNANodeScale: function() {
      var scaleMag = this.getScaleVector();
      return scaleMag.x;
    },
    setBodyCenter: function( bodyCenter ) {
      var scale = this.getTRNANodeScale();
      this.centerX = bodyCenter.x - 10 * scale;
      this.bottom = bodyCenter.y + 15 * scale;
    },
    getBodyCenter: function() {
      var scale = this.getTRNANodeScale();
      return new Vector2( this.centerX + 10 * scale, this.bottom - 15 * scale );
    },
    start: function( event, trail ) {
      this.drag( event, trail );
    },
    drag: function( event, trail ) {
      var trnaNode = this;
      var screenView = this.screenView;

      var proposedBodyCenter = screenView.globalToLocalPoint( event.pointer.point );

      var snapped = false;
      //TODO: make sure types are compatible (AT, GC)
      var connectionPoints = screenView.connectionModel.getConnectionPointsForTRNA( trnaNode );
      if ( connectionPoints.length > 0 ) {
        var closestConnectionPoint = _.min( connectionPoints, function( connectionPoint ) {return connectionPoint.point.distance( proposedBodyCenter );} );
        var newPoint = closestConnectionPoint.point.plusXY( 80 - screenView.viewProperties.numAminoAcids * BaseShape.BODY_WIDTH * 3 * BaseNode.fullSize, 60 );
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

      var proposedBodyCenter = screenView.globalToLocalPoint( event.pointer.point );

      var snapped = false;
      //TODO: make sure types are compatible (AT, GC)
      var connectionPoints = screenView.connectionModel.getConnectionPointsForTRNA( trnaNode );
      if ( connectionPoints.length > 0 ) {
        var closestConnectionPoint = _.min( connectionPoints, function( connectionPoint ) {return connectionPoint.point.distance( proposedBodyCenter );} );
        var newPoint = closestConnectionPoint.point.plusXY( 80 - screenView.viewProperties.numAminoAcids * BaseShape.BODY_WIDTH * 3 * BaseNode.fullSize, 60 );
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
        new TWEEN.Tween( { x: trnaNode.x, y: trnaNode.y, scale: initScale} )
          .to( { x: trnaNode.initialX, y: trnaNode.initialY, scale: 0.2}, 700 )
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
    }
  } );
} );