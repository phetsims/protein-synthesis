//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the ConnectionModel, includes its shape and metrics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ConnectionPoint = require( 'PROTEIN_SYNTHESIS/protein-synthesis/view/ConnectionPoint' );

  var CENTER_INDEX = 50;
  var LENGTH = CENTER_INDEX * 2;

  /**
   * Main constructor for ConnectionModel
   * @constructor
   */
  function ConnectionModel( x, y ) {
    PropertySet.call( this, {events: true} );//note to self, this just has events.  Maybe one day it should extend events if no other properties gained
    this.x = x;
    this.y = y;
    this.top = [];
    this.bottom = [];

    for ( var i = 0; i < LENGTH; i++ ) {
      this.top.push( null );
      this.bottom.push( null );
    }
  }

  return inherit( PropertySet, ConnectionModel, {
    get size() {
      var s = 0;
      for ( var i = 0; i < LENGTH; i++ ) {
        if ( this.top[i] !== null ) {
          s++;
        }
        if ( this.bottom[i] !== null ) {
          s++;
        }
      }
      return s;
    },

    get isEmpty() {
      return this.size === 0;
    },
    add: function( i, j, baseNode ) {
      if ( j == 0 ) {
        this.top[i] = baseNode;
      }
      else {
        this.bottom[i] = baseNode;
      }
      this.trigger( 'changed' );
    },
    remove: function( baseNode ) {
      var removed = false;
      for ( var i = 0; i < LENGTH; i++ ) {
        if ( this.top[i] === baseNode ) {
          removed = true;
          this.top[i] = null;
        }
        if ( this.bottom[i] === baseNode ) {
          removed = true;
          this.top[i] = null;
        }
      }
      this.trigger( 'changed' );
    },
    getConnectionPoints: function( baseNode ) {
      var connectionModel = this;
      var connectionPoints = [];

      //for every filled cell, if its left/right neighbor is empty, that is a valid connection point.
      //top to the left
      var adjacent = function( array, deltaI ) {
        var isTop = (array === connectionModel.top);
        for ( var i = 1; i < LENGTH - 1; i++ ) {
          if ( array[i] !== null ) {
            if ( array[i + deltaI] === null ) {
              (function( i ) {
                var di = i + deltaI - CENTER_INDEX;
                var x = connectionModel.x + di * 84;
                connectionPoints.push( new ConnectionPoint( x, connectionModel.y + (isTop ? 0 : 123), !isTop, function() { connectionModel.add( i + deltaI, isTop ? 0 : 1, baseNode ); } ) );
              })( i );
            }
          }
        }
      };
      adjacent( connectionModel.top, -1 );
      adjacent( connectionModel.top, +1 );
      adjacent( connectionModel.bottom, -1 );
      adjacent( connectionModel.bottom, +1 );

      var across = function( sourceArray, targetArray ) {
        var targetIsBottom = targetArray === connectionModel.bottom;

        for ( var i = 0; i < LENGTH; i++ ) {
          if ( sourceArray[i] !== null ) {
            if ( targetArray[i] === null ) {

              //make sure they are compatible: A-T, G-C
              if ( sourceArray[i].base.canHydrogenBond( baseNode.base ) ) {

                (function( i ) {

                  var deltaI = 0;
                  var di = i + deltaI - CENTER_INDEX;
                  var x = connectionModel.x + di * 84;

                  var cp = new ConnectionPoint(
                    x,
                    ( connectionModel.y + (targetIsBottom ? 123 : 0)),
                    targetIsBottom,
                    function() {
                      connectionModel.add( i + deltaI, targetIsBottom ? 1 : 0, baseNode );
                    } );
                  connectionPoints.push( cp );
                })( i );
              }
            }
          }
        }
      };
      across( connectionModel.top, connectionModel.bottom );
      across( connectionModel.bottom, connectionModel.top );

      if ( connectionPoints.length === 0 ) {
        connectionPoints.push( new ConnectionPoint( this.x, this.y, false, function() { connectionModel.add( CENTER_INDEX, 0, baseNode ); } ) );
      }

      return connectionPoints;
    }
  } );
} );