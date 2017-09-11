// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for the 'ProteinSynthesis' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Base = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Base' );
  var BaseShape = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/BaseShape' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var proteinSynthesis = require( 'PROTEIN_SYNTHESIS/proteinSynthesis' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );

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
    var self = this;
    this.inCarousel = true;
    this.pointingUp = true;

    //TODO: Use MovableDragHandler to constrain bounds?
    if ( individuallyDraggable ) {
      var dragBase = function( event, trail ) {
        var proposedBodyCenter = screenView.globalToLocalPoint( event.pointer.point );
        if ( proposedBodyCenter.y < Y_THRESHOLD_FOR_UPSIDE_UP ) {
          self.setPointingUp( false );
          self.setBodyCenter( proposedBodyCenter );
        }
        else {
          self.setPointingUp( true );
          self.setBodyCenter( proposedBodyCenter );
        }

        var updatedLocation = false;
        //TODO: make sure types are compatible (AT, GC)
        var connectionPoints = screenView.getConnectionPoints( self );
        if ( connectionPoints.length > 0 ) {
          var closestConnectionPoint = _.minBy( connectionPoints, function( connectionPoint ) {return connectionPoint.point.distance( proposedBodyCenter );} );
          if ( closestConnectionPoint.point.distance( proposedBodyCenter ) < 30 ) {

            //Close enough for connection.
            console.log( 'close' );

            self.setPointingUp( closestConnectionPoint.up );
            self.setBodyCenter( closestConnectionPoint.point );
            updatedLocation = true;
          }
        }
        if ( !updatedLocation ) {
          self.setBodyCenter( proposedBodyCenter );
        }
      };

      self.addInputListener( new SimpleDragHandler( {
        start: function( event, trail ) {

          screenView.connectionModel.remove( self );
          self.inCarousel = false;
          //increase size, pop out of carousel, create another one behind it in carousel (or already had a stack there?)
          self.detach();
          self.setScaleMagnitude( fullSize );
          screenView.worldNode.addChild( self );
          dragBase( event, trail );
        },
        drag: dragBase,
        end: function( event, trail ) {
          var proposedBodyCenter = screenView.globalToLocalPoint( event.pointer.point );

          var updatedLocation = false;
          //TODO: make sure types are compatible (AT, GC)
          var connectionPoints = screenView.getConnectionPoints( self );
          if ( connectionPoints.length > 0 ) {
            var closestConnectionPoint = _.minBy( connectionPoints, function( connectionPoint ) {return connectionPoint.point.distance( proposedBodyCenter );} );
            if ( closestConnectionPoint.point.distance( proposedBodyCenter ) < 45 ) {

              //Close enough for connection.
              console.log( 'close' );

              //Rotate so it could connect.
              self.setPointingUp( closestConnectionPoint.up );
              self.setBodyCenter( closestConnectionPoint.point );
              updatedLocation = true;
              closestConnectionPoint.connect();
            }
          }
          if ( !updatedLocation ) {

            var initScale = self.getScaleVector().x;
            new TWEEN.Tween( { x: self.x, y: self.y, scale: initScale } )
              .to( { x: self.initialX, y: self.initialY, scale: 0.4 }, 700 )
              .easing( TWEEN.Easing.Cubic.InOut )
              .onUpdate( function() {
                if ( this.y > Y_THRESHOLD_FOR_UPSIDE_UP ) {
                  self.setPointingUp( true );
                }
                self.setScaleMagnitude( this.scale );
                self.setTranslation( this.x, this.y );
              } )
              .start( phet.joist.elapsedTime );
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
      this.base.angleProperty.value = this.pointingUp ? 0 : Math.PI;
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