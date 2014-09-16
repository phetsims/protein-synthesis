//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );

  /**
   *
   * @constructor
   */
  function AminoAcidNode() {
    var path = new Path( 'M565.872,442.615H398.377c14.854-6.758,25.188-21.718,25.188-39.102c0-15.658-8.382-29.354-20.9-36.859c12.519-7.505,20.9-21.2,20.9-36.858c0-13.477-6.212-25.498-15.923-33.373c9.711-7.874,15.923-19.895,15.923-33.372c0-9.077-2.823-17.491-7.629-24.427c9.637-0.692,17.244-8.709,17.244-18.522c0-10.267-8.322-18.59-18.59-18.59c-10.267,0-18.589,8.323-18.589,18.59c0,1.007,0.102,1.987,0.256,2.951c-4.849-1.897-10.12-2.951-15.641-2.951c-5.008,0-9.812,0.866-14.281,2.441c0.105-0.801,0.179-1.612,0.179-2.441c0-10.267-8.323-18.59-18.59-18.59s-18.59,8.323-18.59,18.59c0,9.404,6.989,17.156,16.052,18.396c-4.859,6.96-7.718,15.42-7.718,24.553c0,13.477,6.212,25.498,15.923,33.372c-9.711,7.875-15.923,19.896-15.923,33.373c0,15.658,8.382,29.354,20.901,36.858c-12.519,7.505-20.901,21.201-20.901,36.859c0,17.384,10.334,32.344,25.188,39.102H196.641l-28.205,28.205l28.205,28.205h369.231l-25-28.205L565.872,442.615z',
      {fill: 'pink', lineWidth: 2, stroke: 'black', centerX: 0, centerY: 0, scale: 0.68} );
    Node.call( this, {children: [
      path,
      new Text( 'Glutamic Acid', {center: path.centerBottom.plusXY( 0, -20 )} )
    ]} );
  }

  return inherit( Node, AminoAcidNode );
} );