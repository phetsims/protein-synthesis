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
  var Guanine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Guanine' );
  var Cytosine = require( 'PROTEIN_SYNTHESIS/protein-synthesis/model/Cytosine' );
  var BaseNode = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/BaseNode' );

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

    //TODO: While dragging, show a drop shadow

    this.addChild( new ResetAllButton( { right: this.layoutBounds.maxX - 10, bottom: this.layoutBounds.maxY - 10} ) );

    this.baseNodes = [];

    var createPath = function( base ) {
      var baseNode = new BaseNode( base, proteinSynthesisScreenView );
      proteinSynthesisScreenView.baseNodes.push( baseNode );
      return baseNode;
    };
    this.addChild( new HCarousel( [
      createPath( new Adenine() ),
      createPath( new Thymine() ),
      createPath( new Guanine() ),
      createPath( new Cytosine() ),
      createPath( new Adenine() ),
      createPath( new Thymine() ),
      createPath( new Guanine() ),
      createPath( new Cytosine() ),
    ], { left: this.layoutBounds.minX + 10, bottom: this.layoutBounds.maxY - 10} ) );
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
    getConnectionPoints: function() {
      var connectionPoints = [];
      for ( var i = 0; i < this.baseNodes.length; i++ ) {
        var baseNode = this.baseNodes[i];

        connectionPoints.push( {baseNode: baseNode, side: 'left', position: new Vector2( baseNode.centerX - 140, baseNode.centerY ) } );

        //TODO: make sure it wasn't in carousel
        if ( isCloseTo( baseNode.centerX - path.centerX, 140, 10 ) && isCloseTo( baseNode.bottom, path.bottom, 10 ) ) {

        }
      }
      return connectionPoints;
    }
  } );
} );