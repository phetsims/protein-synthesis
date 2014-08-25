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
  var HCarousel = require( 'PROTEIN_SYNTHESIS/common/view/HCarousel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Adenine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Adenine' );
  var Thymine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Thymine' );
  var Guanine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Guanine' );
  var Cytosine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Cytosine' );

  /**
   * Constructor for the BaseNode
   * @constructor
   */
  function BaseNode( base, screenView ) {

    //Generated in Illustrator, see the mockup
    var outline = 'M536.2,288.1c-4.5,0-8.5,1.9-10.9,4.9h-11.4v-23.4 c0-2.4-2-4.4-4.4-4.4h-22.4v-38.4l-16.1,16.1l-16.5-16.5H454v38.7h-39.3c-2.4,0-4.4,2-4.4,4.4V293h11.4c2.4-3,6.4-4.9,10.9-4.9 c7.4,0,13.4,5.3,13.4,11.7c0,6.5-6,11.7-13.4,11.7c-4.5,0-8.5-1.9-10.9-4.9h-11.4v23.4c0,2.4,2,4.4,4.4,4.4h94.7 c2.4,0,4.4-2,4.4-4.4v-23.4h11.4c2.4,3,6.4,4.9,10.9,4.9c7.4,0,13.4-5.3,13.4-11.7C549.6,293.4,543.6,288.1,536.2,288.1z';
    var options = {fill: 'white', stroke: 'black', scale: 0.6, cursor: 'pointer'};

    Path.call( this, base.shape, options );
    var baseNode = this;

    base.angleProperty.link( function( angle ) {
      baseNode.setRotation( angle );
    } );
    //TODO: Use MovableDragHandler to constrain bounds?
    baseNode.addInputListener( new SimpleDragHandler( {
      start: function( event, trail ) {

        //increase size, pop out of carousel, create another one behind it in carousel (or already had a stack there?)
        baseNode.detach();
        baseNode.setScaleMagnitude( 1 );
        screenView.addChild( baseNode );
        this.drag( event, trail );
      },
      drag: function( event, trail ) {
        baseNode.centerBottom = screenView.globalToLocalPoint( event.pointer.point );

//        var connectionPoints = screenView.getConnectionPoints( baseNode );

        //(hopefully temporary code) that flips the base if you are close to the top or bottom of the screen
        if ( baseNode.bottom < 100 ) {
          base.angle = Math.PI;
        }
        if ( baseNode.bottom > 500 ) {
          base.angle = 0;
        }
      },
      end: function( event, trail ) {
        screenView.baseNodeDropped( baseNode );
      }
    } ) );
    return  baseNode;
  }

  return inherit( Path, BaseNode );
} );