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
  var BaseNode = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/BaseNode' );
  var Node = require( 'SCENERY/nodes/Node' );

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
    this.hydrogenBonds = [];
    this.backboneBonds = [];

    var createPath = function( base ) {
      var baseNode = new BaseNode( base, proteinSynthesisScreenView );
      proteinSynthesisScreenView.baseNodes.push( baseNode );
      return baseNode;
    };
    var createStack = function( constructor ) {
      var children = [];
      for ( var i = 0; i < 5; i++ ) {
        var path = createPath( constructor() );
        path.translate( i * 4, i * 4 );
        children.push( path );
      }
      return new Node( {children: children} );
    };
    this.addChild( new HCarousel( [
      createStack( function() {return new Adenine()} ),
      createStack( function() {return new Thymine()} ),
      createStack( function() {return new Guanine()} ),
      createStack( function() {return new Cytosine()} ),
      createStack( function() {return new Adenine()} ),
      createStack( function() {return new Thymine()} ),
      createStack( function() {return new Guanine()} ),
      createStack( function() {return new Cytosine()} )
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
    getConnectionPoints: function( originBasePair ) {
      var connectionPoints = [];
      for ( var i = 0; i < this.baseNodes.length; i++ ) {
        var baseNode = this.baseNodes[i];

        //Make sure it wasn't in carousel
        if ( baseNode !== originBasePair && !baseNode.inCarousel ) {
          //find any unbonded points of attachment on it.

          //is it hydrogen bonded?
          if ( !this.isHydrogenBonded( baseNode ) ) {

            //Handle up/down
            if ( baseNode.pointingUp ) {
              connectionPoints.push( {type: 'hydrogen', baseNode: baseNode, bodyCenter: baseNode.getBodyCenter().plusXY( 0, -180 )} );
            }
            else {
              connectionPoints.push( {type: 'hydrogen', baseNode: baseNode, bodyCenter: baseNode.getBodyCenter().plusXY( 0, +180 )} );
            }
          }
          if ( !this.isRightSideBonded( baseNode ) ) {
            connectionPoints.push( {type: 'right', baseNode: baseNode, bodyCenter: baseNode.getBodyCenter().plusXY( 140, 0 )} );
          }
          if ( !this.isLeftSideBonded( baseNode ) ) {
            connectionPoints.push( {type: 'left', baseNode: baseNode, bodyCenter: baseNode.getBodyCenter().plusXY( -140, 0 )} );
          }
        }
      }
      return connectionPoints;
    },
    isHydrogenBonded: function( baseNode ) {
      for ( var j = 0; j < this.hydrogenBonds.length; j++ ) {
        var bond = this.hydrogenBonds[j];
        if ( bond.contains( baseNode ) ) {
          return true;
        }
      }
    },
    isRightSideBonded: function( baseNode ) {
      for ( var j = 0; j < this.backboneBonds.length; j++ ) {
        var bond = this.backboneBonds[j];
        //If the left side of the bond matches the node, then the node's right side is unavailable
        if ( bond.left === baseNode ) {
          return true;
        }
      }
    },
    isLeftSideBonded: function( baseNode ) {
      for ( var j = 0; j < this.backboneBonds.length; j++ ) {
        var bond = this.backboneBonds[j];
        if ( bond.right === baseNode ) {
          return true;
        }
      }
    }
  } );
} );