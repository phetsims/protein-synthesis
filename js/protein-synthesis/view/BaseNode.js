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
  var Base = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Base' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var BaseShape = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/BaseShape' );
  var Node = require( 'SCENERY/nodes/Node' );

  var Y_THRESHOLD_FOR_UPSIDE_UP = 220;

  /**
   * Constructor for the BaseNode
   * @constructor
   */
  function BaseNode( base, screenView, baseLabelsVisibleProperty, structureLabelsVisibleProperty, individuallyDraggable ) {
    assert && assert( base instanceof Base );

    this.baseLabelsVisibleProperty = baseLabelsVisibleProperty;
    this.structureLabelsVisibleProperty = structureLabelsVisibleProperty;
    this.base = base;

    //Generated in Illustrator, see the mockup
//    var outline = 'M536.2,288.1c-4.5,0-8.5,1.9-10.9,4.9h-11.4v-23.4 c0-2.4-2-4.4-4.4-4.4h-22.4v-38.4l-16.1,16.1l-16.5-16.5H454v38.7h-39.3c-2.4,0-4.4,2-4.4,4.4V293h11.4c2.4-3,6.4-4.9,10.9-4.9 c7.4,0,13.4,5.3,13.4,11.7c0,6.5-6,11.7-13.4,11.7c-4.5,0-8.5-1.9-10.9-4.9h-11.4v23.4c0,2.4,2,4.4,4.4,4.4h94.7 c2.4,0,4.4-2,4.4-4.4v-23.4h11.4c2.4,3,6.4,4.9,10.9,4.9c7.4,0,13.4-5.3,13.4-11.7C549.6,293.4,543.6,288.1,536.2,288.1z';

    var pathNode = new Path( base.shape, {fill: base.backboneType === 'deoxyribose' ? 'white' : '#aee6c8', stroke: 'black', cursor: 'pointer'} );
    Node.call( this, {
      children: [
        pathNode
      ],
      scale: 0.4
    } );
    var baseNode = this;
    this.inCarousel = true;
    this.pointingUp = true;

    //TODO: Use MovableDragHandler to constrain bounds?
    if ( individuallyDraggable ) {
      baseNode.addInputListener( new SimpleDragHandler( {
        start: function( event, trail ) {

          baseNode.inCarousel = false;
          //increase size, pop out of carousel, create another one behind it in carousel (or already had a stack there?)
          baseNode.detach();
          baseNode.setScaleMagnitude( 0.6 );
          screenView.addChild( baseNode );
          this.drag( event, trail );
        },
        drag: function( event, trail ) {
          var proposedBodyCenter = screenView.globalToLocalPoint( event.pointer.point );
          if ( proposedBodyCenter.y < Y_THRESHOLD_FOR_UPSIDE_UP ) {
            baseNode.setPointingUp( false );
            baseNode.setBodyCenter( proposedBodyCenter );
          }
          else {
            baseNode.setPointingUp( true );
            baseNode.setBodyCenter( proposedBodyCenter );
          }

          var updatedLocation = false;
          //TODO: make sure types are compatible (AT, GC)
          var connectionPoints = screenView.getConnectionPoints( baseNode );
          if ( connectionPoints.length > 0 ) {
            var closestConnectionPoint = _.min( connectionPoints, function( connectionPoint ) {return connectionPoint.point.distance( proposedBodyCenter );} );
            if ( closestConnectionPoint.point.distance( proposedBodyCenter ) < 30 ) {

              //Close enough for connection.
              console.log( 'close' );

              baseNode.setPointingUp( closestConnectionPoint.up );
              baseNode.setBodyCenter( closestConnectionPoint.point );
              updatedLocation = true;
            }
          }
          if ( !updatedLocation ) {
            baseNode.setBodyCenter( proposedBodyCenter );
          }
        },
        end: function( event, trail ) {
          var proposedBodyCenter = screenView.globalToLocalPoint( event.pointer.point );

          var updatedLocation = false;
          //TODO: make sure types are compatible (AT, GC)
          var connectionPoints = screenView.getConnectionPoints( baseNode );
          if ( connectionPoints.length > 0 ) {
            var closestConnectionPoint = _.min( connectionPoints, function( connectionPoint ) {return connectionPoint.point.distance( proposedBodyCenter );} );
            if ( closestConnectionPoint.point.distance( proposedBodyCenter ) < 45 ) {

              //Close enough for connection.
              console.log( 'close' );

              //Rotate so it could connect.
              baseNode.setPointingUp( closestConnectionPoint.up );
              baseNode.setBodyCenter( closestConnectionPoint.point );
              updatedLocation = true;
              screenView.addBond( baseNode, closestConnectionPoint );
              closestConnectionPoint.connect();
            }
          }
          if ( !updatedLocation ) {
//            baseNode.setBodyCenter( proposedBodyCenter );
            //Fly back to the toolbox
//            debugger;

//            baseNode.setBodyCenter( bodyNode.initialBodyCenter );
//            baseNode.x = baseNode.initialX;
//            baseNode.y = baseNode.initialY;

            var initScale = baseNode.getScaleVector().x;
            console.log( initScale );
            new TWEEN.Tween( { x: baseNode.x, y: baseNode.y, scale: initScale} )
              .to( { x: baseNode.initialX, y: baseNode.initialY, scale: 0.4}, 700 )
              .easing( TWEEN.Easing.Cubic.InOut )
              .onUpdate( function() {
                if ( this.y > Y_THRESHOLD_FOR_UPSIDE_UP ) {
                  baseNode.setPointingUp( true );
                }
                baseNode.setScaleMagnitude( this.scale );
                baseNode.setTranslation( this.x, this.y );
              } )
              .start();
          }
        }
      } ) );
    }

    var baseLabelNode = new Text( base.abbreviation, {
      font: new PhetFont( 34 ),//Keep in mind the entire node is scaled down
      pickable: false
    } );

    //Handle angle changes
    base.angleProperty.link( function( angle ) {
      pathNode.setRotation( angle );
    } );

    this.baseLabelsVisibleProperty.linkAttribute( baseLabelNode, 'visible' );
    this.addChild( baseLabelNode );
    base.angleProperty.link( function( angle ) {
      if ( angle === 0 ) {
        baseLabelNode.centerX = -BaseShape.NECK_WIDTH / 2 - 15;
        baseLabelNode.centerY = -10;
      }
      else {
        baseLabelNode.centerX = BaseShape.NECK_WIDTH / 2 + 15;
        baseLabelNode.centerY = 10;
      }
    } );

    var structureLabelNode = new Text( base.backboneType, {
      font: new PhetFont( 18 ),
      pickable: false
    } );
    this.structureLabelsVisibleProperty.linkAttribute( structureLabelNode, 'visible' );
    this.addChild( structureLabelNode );
    base.angleProperty.link( function( angle ) {
      if ( angle === 0 ) {
        structureLabelNode.centerX = -17;
        structureLabelNode.bottom = BaseShape.BODY_HEIGHT;
      }
      else {
        structureLabelNode.centerX = +15;
        structureLabelNode.centerY = -BaseShape.BODY_HEIGHT + 14;
      }
    } );
  }

  return inherit( Path, BaseNode, {
    setPointingUp: function( pointingUp ) {
      this.pointingUp = pointingUp;
      this.base.angle = this.pointingUp ? 0 : Math.PI;
    },
    getBaseNodeScale: function() {
      var scaleMag = this.getScaleVector();
      return scaleMag.x;
    },
    setBodyCenter: function( bodyCenter ) {
      var scale = this.getBaseNodeScale();
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
      var scale = this.getBaseNodeScale();
      if ( this.pointingUp ) {
        return new Vector2( this.left + 70 * scale, this.bottom - 50 * scale );
      }
      else {
        return new Vector2( this.right - 70 * scale, this.top + 50 * scale );
      }
    },
    setInitialPosition: function( x, y ) {
      this.initialX = x;
      this.initialY = y;
      this.setTranslation( x, y );
//      this.setBodyCenter( new Vector2( x, y ) );
//      this.initialBodyCenter = new Vector2( x, y );
    }
  } );
} );