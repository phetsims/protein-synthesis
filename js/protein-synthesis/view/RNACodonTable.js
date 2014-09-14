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
    var i = 0;

    //Highlight the nodes corresponding to what is in the ribosome, or generally, start to the left of the connection model (or search for a start codon?)
    var highlighted = [];
    for ( i = 0; i < screenView.connectionModel.bottom.length - 2; i++ ) {
      var a = screenView.connectionModel.bottom[i];
      var b = screenView.connectionModel.bottom[i + 1];
      var c = screenView.connectionModel.bottom[i + 2];
      if ( a !== null && b !== null && c !== null ) {
        highlighted.push( '' + a.base.partnerAbbreviation + b.base.partnerAbbreviation + c.base.partnerAbbreviation );
      }
    }
    console.log( 'highlighted', highlighted );
    for ( i = 0; i < choices.length; i++ ) {
      var choice1 = choices[i];
      for ( var j = 0; j < choices.length; j++ ) {
        var choice2 = choices[j];
        for ( var k = 0; k < choices.length; k++ ) {
          var choice3 = choices[k];
          var string = choice1 + choice2 + choice3;
          var textNode = new Text( string, {font: font, left: x, top: y, fill: highlighted.indexOf( string ) >= 0 ? 'black' : '#bbbbbb'} );
          children.push( textNode );
          y += textNode.height + 2;

          (function( string ) {
            var createdNode = null;
            textNode.addInputListener( new SimpleDragHandler( {
              start: function( event, trail ) {

                createdNode = screenView.createTRNANode( string );
                screenView.addChild( createdNode );
                createdNode.start( event, trail );
              },
              drag: function( event, trail ) {
                createdNode.drag( event, trail );
              },
              end: function( event, trail ) {
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