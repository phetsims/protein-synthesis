// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for the 'ProteinSynthesis' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var proteinSynthesis = require( 'PROTEIN_SYNTHESIS/proteinSynthesis' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Base = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Base' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var BaseShape = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/BaseShape' );
  var Node = require( 'SCENERY/nodes/Node' );

  var Y_THRESHOLD_FOR_UPSIDE_UP = 220;
  var fullSize = 0.6;

  /**
   * Constructor for the BaseNode
   * @constructor
   */
  function BaseNode( base, screenView, baseLabelsVisibleProperty, labelsVisibleProperty, individuallyDraggable, tRNA ) {
    assert && assert( base instanceof Base );

    this.baseLabelsVisibleProperty = baseLabelsVisibleProperty;
    this.labelsVisibleProperty = labelsVisibleProperty;
    this.base = base;

    // Leave the dna nucleotide visible if it was bubbled out for transcription, see #16
    this.bubbledOutForTranscription = false;

    var fill = tRNA ? '#f9b664' :
               base.backboneType === 'deoxyribose' ? 'white' : '#aee6c8';

    var pathNode = new Path( base.shape, { fill: fill, stroke: 'black', cursor: 'pointer' } );
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
      var dragBase = function( event, trail ) {
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
      };

      baseNode.addInputListener( new SimpleDragHandler( {
        start: function( event, trail ) {

          screenView.connectionModel.remove( baseNode );
          baseNode.inCarousel = false;
          //increase size, pop out of carousel, create another one behind it in carousel (or already had a stack there?)
          baseNode.detach();
          baseNode.setScaleMagnitude( fullSize );
          screenView.worldNode.addChild( baseNode );
          dragBase( event, trail );
        },
        drag: dragBase,
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
              closestConnectionPoint.connect();
            }
          }
          if ( !updatedLocation ) {

            var initScale = baseNode.getScaleVector().x;
            new TWEEN.Tween( { x: baseNode.x, y: baseNode.y, scale: initScale } )
              .to( { x: baseNode.initialX, y: baseNode.initialY, scale: 0.4 }, 700 )
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
        baseLabelNode.centerX = -BaseShape.NECK_WIDTH / 2 - 15 + 4;
        baseLabelNode.centerY = -10;
      }
      else {
        baseLabelNode.centerX = BaseShape.NECK_WIDTH / 2 + 15 - 4;
        baseLabelNode.centerY = 12;
      }
    } );

    var sugarLabelNode = new Text( base.backboneType, { font: new PhetFont( 16 ), pickable: false } );
    this.labelsVisibleProperty.linkAttribute( sugarLabelNode, 'visible' );
    this.addChild( sugarLabelNode );
    base.angleProperty.link( function( angle ) {
      if ( angle === 0 ) {
        sugarLabelNode.centerX = -17;
        sugarLabelNode.bottom = BaseShape.BODY_HEIGHT;
      }
      else {
        sugarLabelNode.centerX = +15;
        sugarLabelNode.centerY = -BaseShape.BODY_HEIGHT + 14;
      }
    } );

    var phosphateLabelNode = new Text( 'phosphate', { font: new PhetFont( 16 ), pickable: false } );
    this.labelsVisibleProperty.linkAttribute( phosphateLabelNode, 'visible' );
    this.addChild( phosphateLabelNode );
    base.angleProperty.link( function( angle ) {
      if ( angle === 0 ) {
        phosphateLabelNode.centerX = -17 + 70 + 8;
        phosphateLabelNode.bottom = BaseShape.BODY_HEIGHT - 42;
      }
      else {
        phosphateLabelNode.centerX = +15 - 70 - 8 + 3;
        phosphateLabelNode.centerY = -BaseShape.BODY_HEIGHT + 14 + 40 - 7;
      }
    } );
  }

  proteinSynthesis.register( 'BaseNode', BaseNode );
  
  return inherit( Node, BaseNode, {
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
    setInitialPosition: function( x, y ) {
      this.initialX = x;
      this.initialY = y;
      this.setTranslation( x, y );
    }
  }, {
    fullSize: fullSize
  } );
} );