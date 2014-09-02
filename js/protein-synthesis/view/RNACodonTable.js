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
  var TRNANode = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/TRNANode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * Constructor for the RNACodonTable
   * @constructor
   */
  function RNACodonTable( screenView, options ) {

    var font = new PhetFont( 18 );
    var choices = ['U', 'C', 'A', 'G'];
    var index = 0;
    var children = [];
    var previous = null;
    var x = 0;
    var y = 0;
    var highlighted = ['AUG', 'GAG'];
    for ( var i = 0; i < choices.length; i++ ) {
      var choice1 = choices[i];
      for ( var j = 0; j < choices.length; j++ ) {
        var choice2 = choices[j];
        for ( var k = 0; k < choices.length; k++ ) {
          var choice3 = choices[k];
          var string = choice1 + choice2 + choice3;
          var textNode = new Text( string, {font: font, left: x, top: y, fill: highlighted.indexOf( string ) >= 0 ? 'black' : '#bbbbbb'} );
          children.push( textNode );
          y += textNode.height + 2;
//          var codon = new TRNANode( string, this, viewProperties.baseLabelsVisibleProperty, viewProperties.structureLabelsVisibleProperty );
//          codon.left = 0;
//          codon.top = previous ? previous.bottom + 2 : this.layoutBounds.top;

          (function( string ) {
            var createdNode = null;
            textNode.addInputListener( new SimpleDragHandler( {
              start: function( event, trail ) {

//              baseNode.inCarousel = false;
//              //increase size, pop out of carousel, create another one behind it in carousel (or already had a stack there?)
//              baseNode.detach();
//              baseNode.setScaleMagnitude( 0.6 );
//              screenView.addChild( baseNode );
//              this.drag( event, trail );
                createdNode = new TRNANode( string, screenView, screenView.viewProperties.baseLabelsVisibleProperty, screenView.viewProperties.structureLabelsVisibleProperty );
                screenView.addChild( createdNode );
                this.drag( event, trail );
              },
              drag: function( event, trail ) {
//        var proposedCenterBottom = screenView.globalToLocalPoint( event.pointer.point );
                var proposedBodyCenter = screenView.globalToLocalPoint( event.pointer.point );
                createdNode.center = proposedBodyCenter;
//
//              var updatedLocation = false;
//              //TODO: make sure types are compatible (AT, GC)
//              var connectionPoints = screenView.getConnectionPoints( baseNode );
//              if ( connectionPoints.length > 0 ) {
//                var closestConnectionPoint = _.min( connectionPoints, function( connectionPoint ) {return connectionPoint.bodyCenter.distance( proposedBodyCenter );} );
//                if ( closestConnectionPoint.bodyCenter.distance( proposedBodyCenter ) < 30 ) {
//
//                  //Close enough for connection.
//                  console.log( 'close' );
//
//                  //Rotate so it could connect.
//                  if ( closestConnectionPoint.type === 'hydrogen' ) {
//                    baseNode.setPointingUp( !closestConnectionPoint.baseNode.pointingUp );
//                    baseNode.setBodyCenter( closestConnectionPoint.bodyCenter );
//                    updatedLocation = true;
//
//                  }
//                  else {
//                    baseNode.setPointingUp( closestConnectionPoint.baseNode.pointingUp );
//                    baseNode.setBodyCenter( closestConnectionPoint.bodyCenter );
//                    updatedLocation = true;
//                  }
//                }
//              }
//              if ( !updatedLocation ) {
//                baseNode.setBodyCenter( proposedBodyCenter );
//              }
              },
              end: function( event, trail ) {
//              var proposedBodyCenter = screenView.globalToLocalPoint( event.pointer.point );
//
//              var updatedLocation = false;
//              //TODO: make sure types are compatible (AT, GC)
//              var connectionPoints = screenView.getConnectionPoints( baseNode );
//              if ( connectionPoints.length > 0 ) {
//                var closestConnectionPoint = _.min( connectionPoints, function( connectionPoint ) {return connectionPoint.bodyCenter.distance( proposedBodyCenter );} );
//                if ( closestConnectionPoint.bodyCenter.distance( proposedBodyCenter ) < 30 ) {
//
//                  //Close enough for connection.
//                  console.log( 'close' );
//
//                  //Rotate so it could connect.
//                  if ( closestConnectionPoint.type === 'hydrogen' ) {
//                    baseNode.setPointingUp( !closestConnectionPoint.baseNode.pointingUp );
//                    baseNode.setBodyCenter( closestConnectionPoint.bodyCenter );
//                    updatedLocation = true;
//                    screenView.addBond( baseNode, closestConnectionPoint );
//                  }
//                  else {
//                    baseNode.setPointingUp( closestConnectionPoint.baseNode.pointingUp );
//                    baseNode.setBodyCenter( closestConnectionPoint.bodyCenter );
//                    updatedLocation = true;
//                    screenView.addBond( baseNode, closestConnectionPoint );
//                  }
//                }
//              }
//              if ( !updatedLocation ) {
//                baseNode.setBodyCenter( proposedBodyCenter );
//              }
              }
            } ) );
          })( string );

          previous = textNode;

          if ( (index + 1) % 4 === 0 ) {
            y += 8;
          }

          if ( (index + 1) % 16 === 0 ) {
            x = x + 48;
            y = 0;
          }

          index++;
        }
      }
    }

    Node.call( this, {children: children} );
    this.mutate( options );
  }

  return inherit( Path, RNACodonTable, {
    setPointingUp: function( pointingUp ) {
      this.pointingUp = pointingUp;
      this.base.angle = this.pointingUp ? 0 : Math.PI;
    },
    getRNACodonTableScale: function() {
      var scaleMag = this.getScaleVector();
      return scaleMag.x;
    },
    setBodyCenter: function( bodyCenter ) {
      var scale = this.getRNACodonTableScale();
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
      var scale = this.getRNACodonTableScale();
      if ( this.pointingUp ) {
        return new Vector2( this.left + 70 * scale, this.bottom - 50 * scale );
      }
      else {
        return new Vector2( this.right - 70 * scale, this.top + 50 * scale );
      }
    }
  } );
} );