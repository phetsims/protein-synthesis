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
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Adenine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Adenine' );
  var Guanine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Guanine' );
  var Cytosine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Cytosine' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BaseNode = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/BaseNode' );
  var Uracil = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Uracil' );
  var Shape = require( 'KITE/Shape' );

  /**
   * Constructor for the TRNANode
   * @constructor
   */
  function TRNANode( triplet, screenView, baseLabelsVisibleProperty, structureLabelsVisibleProperty ) {

//    debugger;

    var trnaNode = this;
    var children = [];

//    var aminoAcidNode = new Path( 'M433.18,220.103c0-10.267-8.322-18.59-18.59-18.59c-10.267,0-18.589,8.323-18.589,18.59c0,1.007,0.102,1.987,0.256,2.951c-4.849-1.897-10.12-2.951-15.641-2.951c-5.008,0-9.812,0.866-14.281,2.441c0.105-0.801,0.179-1.612,0.179-2.441c0-10.267-8.323-18.59-18.59-18.59s-18.59,8.323-18.59,18.59c0,9.404,6.989,17.156,16.052,18.396c-4.859,6.96-7.718,15.42-7.718,24.553c0,13.477,6.212,25.498,15.923,33.372c-9.711,7.875-15.923,19.896-15.923,33.373c0,15.658,8.382,29.354,20.901,36.858c-12.519,7.505-20.901,21.201-20.901,36.859c0,23.72,19.229,42.948,42.949,42.948c23.72,0,42.949-19.229,42.949-42.948c0-15.658-8.382-29.354-20.9-36.859c12.519-7.505,20.9-21.2,20.9-36.858c0-13.477-6.212-25.498-15.923-33.373c9.711-7.874,15.923-19.895,15.923-33.372c0-9.077-2.823-17.491-7.629-24.427C425.572,237.933,433.18,229.916,433.18,220.103z',
    var aminoAcidNode = new Path( 'M565.872,442.615H398.377c14.854-6.758,25.188-21.718,25.188-39.102c0-15.658-8.382-29.354-20.9-36.859c12.519-7.505,20.9-21.2,20.9-36.858c0-13.477-6.212-25.498-15.923-33.373c9.711-7.874,15.923-19.895,15.923-33.372c0-9.077-2.823-17.491-7.629-24.427c9.637-0.692,17.244-8.709,17.244-18.522c0-10.267-8.322-18.59-18.59-18.59c-10.267,0-18.589,8.323-18.589,18.59c0,1.007,0.102,1.987,0.256,2.951c-4.849-1.897-10.12-2.951-15.641-2.951c-5.008,0-9.812,0.866-14.281,2.441c0.105-0.801,0.179-1.612,0.179-2.441c0-10.267-8.323-18.59-18.59-18.59s-18.59,8.323-18.59,18.59c0,9.404,6.989,17.156,16.052,18.396c-4.859,6.96-7.718,15.42-7.718,24.553c0,13.477,6.212,25.498,15.923,33.372c-9.711,7.875-15.923,19.896-15.923,33.373c0,15.658,8.382,29.354,20.901,36.858c-12.519,7.505-20.901,21.201-20.901,36.859c0,17.384,10.334,32.344,25.188,39.102H196.641l-28.205,28.205l28.205,28.205h369.231l-25-28.205L565.872,442.615z',
      {fill: 'pink', lineWidth: 2, stroke: 'black', centerX: 0, centerY: 0, scale: 0.6} );

    children.push( aminoAcidNode );
    var trnaBody = new Path( new Shape().moveTo( -40, 35 ).lineToRelative( 15, 40 ).lineToRelative( 150, 0 ).lineToRelative( 15, -40 ).close(), {fill: '#f9b664', stroke: 'black', lineWidth: 1, rotation: Math.PI, left: -30 + 3} );
    children.push( trnaBody );
    aminoAcidNode.centerX = trnaBody.centerX;
    aminoAcidNode.bottom = trnaBody.top;

    for ( var i = 0; i < triplet.length; i++ ) {
      var char = triplet.charAt( i );
      var baseNode = new BaseNode( char === 'A' ? new Adenine() :
                                   char === 'U' ? new Uracil() :
                                   char === 'G' ? new Guanine() :
                                   new Cytosine(),
        screenView, baseLabelsVisibleProperty, structureLabelsVisibleProperty, false );

      //Start as pointing down (as in many textbooks).  TODO: should we allow these to flip vertically?
      baseNode.base.angle = Math.PI;
      baseNode.translate( 140 * i, 0 );
//      baseNode.pickable = false;
      children.push( baseNode );
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
    this.structureLabelsVisibleProperty = structureLabelsVisibleProperty;

    //Generated in Illustrator, see the mockup
//    var outline = 'M536.2,288.1c-4.5,0-8.5,1.9-10.9,4.9h-11.4v-23.4 c0-2.4-2-4.4-4.4-4.4h-22.4v-38.4l-16.1,16.1l-16.5-16.5H454v38.7h-39.3c-2.4,0-4.4,2-4.4,4.4V293h11.4c2.4-3,6.4-4.9,10.9-4.9 c7.4,0,13.4,5.3,13.4,11.7c0,6.5-6,11.7-13.4,11.7c-4.5,0-8.5-1.9-10.9-4.9h-11.4v23.4c0,2.4,2,4.4,4.4,4.4h94.7 c2.4,0,4.4-2,4.4-4.4v-23.4h11.4c2.4,3,6.4,4.9,10.9,4.9c7.4,0,13.4-5.3,13.4-11.7C549.6,293.4,543.6,288.1,536.2,288.1z';

//    var pathNode = new Path( base.shape, {fill: 'white', stroke: 'black', cursor: 'pointer'} );
//    var TRNANode = this;
//    this.inCarousel = true;
//    this.pointingUp = true;
//
//    //TODO: Use MovableDragHandler to constrain bounds?
    this.addInputListener( new SimpleDragHandler( {
      start: function( event, trail ) {

//        TRNANode.inCarousel = false;
//        //increase size, pop out of carousel, create another one behind it in carousel (or already had a stack there?)
//        TRNANode.detach();
//        TRNANode.setScaleMagnitude( 1.5 );
//        screenView.addChild( TRNANode );
//        this.drag( event, trail );
      },
      drag: function( event, trail ) {
//        var proposedCenterBottom = screenView.globalToLocalPoint( event.pointer.point );
        var proposedBodyCenter = screenView.globalToLocalPoint( event.pointer.point );
        trnaNode.center = proposedBodyCenter;
//        var updatedLocation = false;
//        //TODO: make sure types are compatible (AT, GC)
//        var connectionPoints = screenView.getConnectionPoints( TRNANode );
//        if ( connectionPoints.length > 0 ) {
//          var closestConnectionPoint = _.min( connectionPoints, function( connectionPoint ) {return connectionPoint.bodyCenter.distance( proposedBodyCenter );} );
//          if ( closestConnectionPoint.bodyCenter.distance( proposedBodyCenter ) < 30 ) {
//
//            //Close enough for connection.
//            console.log( 'close' );
//
//            //Rotate so it could connect.
//            if ( closestConnectionPoint.type === 'hydrogen' ) {
//              TRNANode.setPointingUp( !closestConnectionPoint.TRNANode.pointingUp );
//              TRNANode.setBodyCenter( closestConnectionPoint.bodyCenter );
//              updatedLocation = true;
//
//            }
//            else {
//              TRNANode.setPointingUp( closestConnectionPoint.TRNANode.pointingUp );
//              TRNANode.setBodyCenter( closestConnectionPoint.bodyCenter );
//              updatedLocation = true;
//            }
//          }
//        }
//        if ( !updatedLocation ) {
//          TRNANode.setBodyCenter( proposedBodyCenter );
//        }
      },
      end: function( event, trail ) {
//        var proposedBodyCenter = screenView.globalToLocalPoint( event.pointer.point );
//
//        var updatedLocation = false;
//        //TODO: make sure types are compatible (AT, GC)
//        var connectionPoints = screenView.getConnectionPoints( TRNANode );
//        if ( connectionPoints.length > 0 ) {
//          var closestConnectionPoint = _.min( connectionPoints, function( connectionPoint ) {return connectionPoint.bodyCenter.distance( proposedBodyCenter );} );
//          if ( closestConnectionPoint.bodyCenter.distance( proposedBodyCenter ) < 30 ) {
//
//            //Close enough for connection.
//            console.log( 'close' );
//
//            //Rotate so it could connect.
//            if ( closestConnectionPoint.type === 'hydrogen' ) {
//              TRNANode.setPointingUp( !closestConnectionPoint.TRNANode.pointingUp );
//              TRNANode.setBodyCenter( closestConnectionPoint.bodyCenter );
//              updatedLocation = true;
//              screenView.addBond( TRNANode, closestConnectionPoint );
//            }
//            else {
//              TRNANode.setPointingUp( closestConnectionPoint.TRNANode.pointingUp );
//              TRNANode.setBodyCenter( closestConnectionPoint.bodyCenter );
//              updatedLocation = true;
//              screenView.addBond( TRNANode, closestConnectionPoint );
//            }
//          }
//        }
//        if ( !updatedLocation ) {
//          TRNANode.setBodyCenter( proposedBodyCenter );
//        }
      }
    } ) );
//
//    var baseLabelNode = new Text( base.abbreviation, {
//      font: new PhetFont( 34 ),//Keep in mind the entire node is scaled down
//      pickable: false
//    } );
//
//    //Handle angle changes
//    base.angleProperty.link( function( angle ) {
//      pathNode.setRotation( angle );
//    } );
//
//    this.baseLabelsVisibleProperty.linkAttribute( baseLabelNode, 'visible' );
//    this.addChild( baseLabelNode );
//    base.angleProperty.link( function( angle ) {
//      if ( angle === 0 ) {
//        baseLabelNode.centerX = -BaseShape.NECK_WIDTH / 2 - 15;
//        baseLabelNode.centerY = -10;
//      }
//      else {
//        baseLabelNode.centerX = BaseShape.NECK_WIDTH / 2 + 15;
//        baseLabelNode.centerY = 10;
//      }
//    } );
//
//    var structureLabelNode = new Text( base.backboneType, {
//      font: new PhetFont( 18 ),
//      pickable: false
//    } );
//    this.structureLabelsVisibleProperty.linkAttribute( structureLabelNode, 'visible' );
//    this.addChild( structureLabelNode );
//    base.angleProperty.link( function( angle ) {
//      if ( angle === 0 ) {
//        structureLabelNode.centerX = -17;
//        structureLabelNode.bottom = BaseShape.BODY_HEIGHT;
//      }
//      else {
//        structureLabelNode.centerX = +15;
//        structureLabelNode.centerY = -BaseShape.BODY_HEIGHT + 14;
//      }
//    } );
  }

  return inherit( Path, TRNANode, {
    setPointingUp: function( pointingUp ) {
      this.pointingUp = pointingUp;
      this.base.angle = this.pointingUp ? 0 : Math.PI;
    },
    getTRNANodeScale: function() {
      var scaleMag = this.getScaleVector();
      return scaleMag.x;
    },
    setBodyCenter: function( bodyCenter ) {
      var scale = this.getTRNANodeScale();
      if ( this.pointingUp ) {
        this.left = bodyCenter.x - 70 * scale;//half body width, TODO magic
        this.bottom = bodyCenter.y + 50 * scale;//half body height
      }
      else {
        this.right = bodyCenter.x + 70 * scale;
        this.top = bodyCenter.y - 50 * scale;
      }
    },
    getBodyCenter: function() {
      var scale = this.getTRNANodeScale();
      if ( this.pointingUp ) {
        return new Vector2( this.left + 70 * scale, this.bottom - 50 * scale );
      }
      else {
        return new Vector2( this.right - 70 * scale, this.top + 50 * scale );
      }
    }
  } );
} );