// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var Path = require( 'SCENERY/nodes/Path' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  function RibosomeNode() {

    var options = {fill: '#5D1A88', stroke: 'black', lineWidth: 4};
    Node.call( this, {
      children: [
        new Path( 'M635.743,400.307c-10.752,32.822-107,10.898-200.641,10.898s-231.41,23.641-231.41-10.898c0-34.54,140.654-62.538,234.295-62.538S647.923,363.127,635.743,400.307z', options ),
        new Path( 'M662.025,199.346c10.877,80.875-103.605,147.756-231.41,147.756c-127.804,0-280.267-82.395-231.41-147.756C270.359,104.154,301.769,76.59,430.615,51.59C556.08,27.246,642.154,51.59,662.025,199.346z', options )
      ],
      scale: 0.8,
      centerX: 300} );
  }

  return inherit( Path, RibosomeNode );
} );