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

    //the number of times it has been moved left through the ribosome, for purposes of only allowing tRNA bonding to the
    //leftmost mRNA
    //number of tRNA that have been bound, corresponds to 3 base pairs (one codon)
    this.numberOfTranslationSteps = 0;
  }

  return inherit( PropertySet, ConnectionModel, {
    get size() {
      return this.sizeTop + this.sizeBottom;
    },
    get sizeTop() {
      var s = 0;
      for ( var i = 0; i < LENGTH; i++ ) {
        if ( this.top[i] !== null ) {
          s++;
        }
      }
      return s;
    },
    get sizeBottom() {
      var s = 0;
      for ( var i = 0; i < LENGTH; i++ ) {
        if ( this.bottom[i] !== null ) {
          s++;
        }
      }
      return s;
    },

    get topBaseNodes() {
      var topBaseNodes = [];
      for ( var i = 0; i < LENGTH; i++ ) {
        if ( this.top[i] !== null ) {
          topBaseNodes.push( this.top[i] );
        }
      }
      return topBaseNodes;
    },
    get bottomBaseNodes() {
      var bottomBaseNodes = [];
      for ( var i = 0; i < LENGTH; i++ ) {
        if ( this.bottom[i] !== null ) {
          bottomBaseNodes.push( this.bottom[i] );
        }
      }
      return bottomBaseNodes;
    },
    get isEmpty() {
      return this.size === 0;
    },
    add: function( i, j, baseNode ) {
      if ( j === 0 ) {
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
          this.bottom[i] = null;
        }
      }
      if ( removed ) {
        this.trigger( 'changed' );
      }
    },
    contains: function( baseNode ) {
      return this.topContains( baseNode ) || this.bottomContains( baseNode );
    },
    topContains: function( baseNode ) {
      for ( var i = 0; i < LENGTH; i++ ) {
        if ( this.top[i] === baseNode ) {
          return true;
        }
      }
    },
    bottomContains: function( baseNode ) {
      for ( var i = 0; i < LENGTH; i++ ) {
        if ( this.bottom[i] === baseNode ) {
          return true;
        }
      }
    },

    get isReadyForTranscription() {
      //needs to have 3+ DNA bases in the coding strand and no gaps.
      return this.sizeTop >= 3 && this.topBoundaryCount === 2;
    },

    get isReadyForTranslation() {
      //needs to have 3+ DNA bases in the coding strand and no gaps.
      return this.sizeBottom >= 3 && this.bottomBoundaryCount === 2;
    },

    //Count the number of fragment starts + stops, to count contiguous segments.
    get topBoundaryCount() {
      var changes = 0;
      var on = this.top[0] !== null;
      for ( var i = 1; i < LENGTH; i++ ) {
        var isOn = this.top[i] !== null;
        if ( on !== isOn ) {
          on = isOn;
          changes++;
        }
      }
      return changes;
    },

    get bottomBoundaryCount() {
      var changes = 0;
      var on = this.bottom[0] !== null;
      for ( var i = 1; i < LENGTH; i++ ) {
        var isOn = this.bottom[i] !== null;
        if ( on !== isOn ) {
          on = isOn;
          changes++;
        }
      }
      return changes;
    },

    getConnectionPoints: function( baseNode ) {
      var connectionModel = this;
      var connectionPoints = [];

      //for every filled cell, if its left/right neighbor is empty, that is a valid connection point.
      //top to the left
      var adjacent = function( array, deltaI ) {
        var isTop = (array === connectionModel.top);
        var otherArray = isTop ? connectionModel.bottom : connectionModel.top;
        for ( var i = 1; i < LENGTH - 1; i++ ) {
          if ( array[i] !== null ) {
            if ( array[i + deltaI] === null ) {

              //prevent inappropriate hydrogen bonds
              //What would the new node be across from?
              var okToBond = true;
              if ( otherArray[i + deltaI] !== null ) {
                if ( !otherArray[i + deltaI].base.canHydrogenBond( baseNode.base ) ) {
                  okToBond = false;
                }
              }

              if ( okToBond ) {
                (function( i ) {
                  var di = i + deltaI - CENTER_INDEX;
                  var x = connectionModel.x + di * 84;
                  connectionPoints.push( new ConnectionPoint( x, connectionModel.y + (isTop ? 0 : 123), !isTop, function() { connectionModel.add( i + deltaI, isTop ? 0 : 1, baseNode ); } ) );
                })( i );
              }
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

                  //TODO: Remove deltaI
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

      // Shouldn't be able to put mRNA on the top, see #13
      // TODO: Perhaps in the future this logic should be above?
      var filtered = [];
      for ( var i = 0; i < connectionPoints.length; i++ ) {
        var connectionPoint = connectionPoints[i];

        // Check to see that this is on the top
        var skip = ( connectionPoint.up === false && baseNode.base.backboneType === 'ribose')

        if ( !skip ) {
          filtered.push( connectionPoint );
        }
      }

      return filtered;
    },

    getMRNACodonStartIndex: function() {
      var connectionModel = this;
      for ( var i = 0; i < this.bottom.length - 2; i++ ) {
        var a = connectionModel.bottom[i];
        var b = connectionModel.bottom[i + 1];
        var c = connectionModel.bottom[i + 2];
        if ( a !== null && b !== null && c !== null ) {
          return i;
        }
      }
      return -1;
    },

    //TODO: This function needs work.  Possibly delegate to above?
    getConnectionPointsForTRNA: function( proteinSynthesisScreenView, tRNANode ) {
      var baseNodes = tRNANode.baseNodes;
      var connectionModel = this;

      var connectionPoints = [];

      //Only allow the (only) codon within the ribosome to connect to tRNA
      var startIndex = this.getMRNACodonStartIndex() + this.numberOfTranslationSteps * 3;

      //Just step once
      //TODO: Rewrite this loop as not a loop, now that we just allow the 1st codon to match in the ribosome
      for ( var i = startIndex; i < startIndex + 1; i++ ) {
        (function( i ) {

          var a = connectionModel.bottom[i];
          var b = connectionModel.bottom[i + 1];
          var c = connectionModel.bottom[i + 2];
          if ( (a !== null && b !== null && c !== null) && (
            a.base.canHydrogenBond( baseNodes[0].base ) &&
            b.base.canHydrogenBond( baseNodes[1].base ) &&
            c.base.canHydrogenBond( baseNodes[2].base )
            ) ) {
            var di = i - CENTER_INDEX;
            var x = connectionModel.x + di * 84 + proteinSynthesisScreenView.distanceMRNATranslated;
            connectionPoints.push( new ConnectionPoint( x, connectionModel.y, true,
              function() {
                connectionModel.add( i - 1, 0, baseNodes[0] );
                connectionModel.add( i, 0, baseNodes[1] );
                connectionModel.add( i + 1, 0, baseNodes[2] );
              } ) );
          }

        })( i );
      }
      return connectionPoints;
    }
  }, {
    CENTER_INDEX: CENTER_INDEX
  } );
} );