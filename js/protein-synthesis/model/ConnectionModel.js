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
        this.top[CENTER_INDEX + i] = baseNode;
      }
      else {
        this.bottom[CENTER_INDEX + i] = baseNode;
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

      if ( this.isEmpty ) {
        connectionPoints.push( new ConnectionPoint( this.x, this.y, false, function() {
          connectionModel.add( 0, 0, baseNode );
        } ) );
      }
      return connectionPoints;
    }
  } );
} );