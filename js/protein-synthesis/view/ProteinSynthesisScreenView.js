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
//  var MovableDragHandler = require( 'SCENERY/input/MovableDragHandler' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Adenine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Adenine' );
  var Thymine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Thymine' );

  /**
   * Constructor for the ProteinSynthesisView
   * @constructor
   */
  function ProteinSynthesisView( model ) {

    var screenView = this;
    ScreenView.call( this, {renderer: 'svg', layoutBounds: ScreenView.UPDATED_LAYOUT_BOUNDS.copy()} );

    //TODO: While dragging, show a drop shadow

    this.addChild( new ResetAllButton( { right: this.layoutBounds.maxX - 10, bottom: this.layoutBounds.maxY - 10} ) );

    //Generated in Illustrator, see the mockup
    var outline = 'M536.2,288.1c-4.5,0-8.5,1.9-10.9,4.9h-11.4v-23.4 c0-2.4-2-4.4-4.4-4.4h-22.4v-38.4l-16.1,16.1l-16.5-16.5H454v38.7h-39.3c-2.4,0-4.4,2-4.4,4.4V293h11.4c2.4-3,6.4-4.9,10.9-4.9 c7.4,0,13.4,5.3,13.4,11.7c0,6.5-6,11.7-13.4,11.7c-4.5,0-8.5-1.9-10.9-4.9h-11.4v23.4c0,2.4,2,4.4,4.4,4.4h94.7 c2.4,0,4.4-2,4.4-4.4v-23.4h11.4c2.4,3,6.4,4.9,10.9,4.9c7.4,0,13.4-5.3,13.4-11.7C549.6,293.4,543.6,288.1,536.2,288.1z';
    var options = {fill: 'white', stroke: 'black', scale: 0.6, cursor: 'pointer'};

    var bases = [];

    var isCloseTo = function( x, y, delta ) {
      return Math.abs( x - y ) <= delta;
    };

    var createPath = function( base ) {
      var path = new Path( base.shape, options );
      bases.push( path );

      //TODO: Use MovableDragHandler to constrain bounds?
      path.addInputListener( new SimpleDragHandler( {
        start: function( event, trail ) {

          //increase size, pop out of carousel, create another one behind it in carousel (or already had a stack there?)
          path.detach();
          path.setScaleMagnitude( 1 );
          screenView.addChild( path );
          this.drag( event, trail );
        },
        drag: function( event, trail ) {
          path.centerBottom = screenView.globalToLocalPoint( event.pointer.point );

          //(hopefully temporary code) that flips the base if you are close to the top or bottom of the screen
          if ( path.centerBottom.y < 100 ) {
            path.setRotation( Math.PI );
          }
          if ( path.centerBottom.y > 500 ) {
            path.setRotation( 0 );
          }
        },
        end: function( event, trail ) {
          //if it was close to another base, snap to it and bond.  maybe show the bond line as gray instead of black+black?

          for ( var i = 0; i < bases.length; i++ ) {
            var base = bases[i];

            //Just to the left of an open base

            //TODO: Factor out magic number 140, the width of the body shape (See Base.js)
            if ( base !== path && isCloseTo( base.centerX - path.centerX, 140, 10 ) && isCloseTo( base.bottom, path.bottom, 10 ) ) {
              path.centerX = base.centerX - 140;
              path.bottom = base.bottom;
              break;
            }
            else if ( base !== path && isCloseTo( base.centerX - path.centerX, -140, 10 ) && isCloseTo( base.bottom, path.bottom, 10 ) ) {
              path.centerX = base.centerX + 140;
              path.bottom = base.bottom;
              break;
            }
          }
        }
      } ) );
      return  path;
    };
    this.addChild( new HCarousel( [
      createPath( new Adenine() ),
      createPath( new Thymine() ),
      createPath( new Adenine() ),
      createPath( new Thymine() ),
      createPath( new Adenine() ),
      createPath( new Thymine() ),
      createPath( new Adenine() ),
      createPath( new Thymine() ),
    ], { left: this.layoutBounds.minX + 10, bottom: this.layoutBounds.maxY - 10} ) );
  }

  return inherit( ScreenView, ProteinSynthesisView );
} );