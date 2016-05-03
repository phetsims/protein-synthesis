// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for the 'ProteinSynthesis' screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var proteinSynthesis = require( 'PROTEIN_SYNTHESIS/proteinSynthesis' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Node = require( 'SCENERY/nodes/Node' );

  var table = {
    UUU: 'phe',
    UUC: 'phe',
    UUA: 'leu',
    UUG: 'leu',
    CUU: 'leu',
    CUC: 'leu',
    CUA: 'leu',
    CUG: 'leu',
    AUU: 'ile',
    AUC: 'ile',
    AUA: 'ile',
    AUG: 'met',
    GUU: 'val',
    GUC: 'val',
    GUA: 'val',
    GUG: 'val',

    UCU: 'ser',
    UCC: 'ser',
    UCA: 'ser',
    UCG: 'ser',
    CCU: 'pro',
    CCC: 'pro',
    CCA: 'pro',
    CCG: 'pro',
    ACU: 'thr',
    ACC: 'thr',
    ACA: 'thr',
    ACG: 'thr',
    GCU: 'ala',
    GCC: 'ala',
    GCA: 'ala',
    GCG: 'ala',

    UAU: 'tyr',
    UAC: 'tyr',
    UAA: 'stop',
    UAG: 'stop',
    CAU: 'his',
    CAC: 'his',
    CAA: 'gln',
    CAG: 'gln',
    AAU: 'asn',
    AAC: 'asn',
    AAA: 'lys',
    AAG: 'lys',
    GAU: 'asp',
    GAC: 'asp',
    GAA: 'glu',
    GAG: 'glu',

    UGU: 'cys',
    UGC: 'cys',
    UGA: 'stop',
    UGG: 'trp',
    CGU: 'arg',
    CGC: 'arg',
    CGA: 'arg',
    CGG: 'arg',
    AGU: 'ser',
    AGC: 'ser',
    AGA: 'arg',
    AGG: 'arg',
    GGU: 'gly',
    GGC: 'gly',
    GGA: 'gly',
    GGG: 'gly'
  };

  /**
   * Constructor for the RNACodonTable
   * NOTE: this will be scaled by the eventual view scale for translation
   * @constructor
   */
  function RNACodonTable( screenView, translationScaleFactor, options ) {

    var font = new PhetFont( 25 );
    var choices = [ 'U', 'C', 'A', 'G' ];
    var index = 0;
    var children = [];
    var x = 0;
    var y = 0;
    var i = 0;

    //Highlight the nodes corresponding to what is in the ribosome, or generally, start to the left of the connection model (or search for a start codon?)
    var highlighted = [];
    for ( i = 0; i < screenView.connectionModel.bottom.length - 2; i++ ) {
      var a = screenView.connectionModel.bottom[ i ];
      var b = screenView.connectionModel.bottom[ i + 1 ];
      var c = screenView.connectionModel.bottom[ i + 2 ];
      if ( a !== null && b !== null && c !== null ) {

        //The RNA codon table refers to what is in the mRNA, not what is in the pairing tRNA
        highlighted.push( '' + a.base.abbreviation + b.base.abbreviation + c.base.abbreviation );
      }
    }

    // Copied from Base.js
    // TODO: Factor out
    var opposite = function( a ) {
      var result = a === 'A' ? 'U' :
                   a === 'U' ? 'A' :
                   a === 'C' ? 'G' :
                   a === 'G' ? 'C' : null;
      assert && assert( result !== null );
      return result;
    };

    for ( i = 0; i < choices.length; i++ ) {
      var choice1 = choices[ i ];
      for ( var j = 0; j < choices.length; j++ ) {
        var choice2 = choices[ j ];
        for ( var k = 0; k < choices.length; k++ ) {
          var choice3 = choices[ k ];

          // These will be the nucleotides in the tRNA
          var tRNATriplet = choice1 + choice2 + choice3;

          // This is the codon triplet, for the codon table
          var mRNATriplet = opposite( choice1 ) + opposite( choice2 ) + opposite( choice3 );
          var textNode = new Text( tRNATriplet, {
            font: font,
            left: x,
            top: y,
            fill: highlighted.indexOf( tRNATriplet ) >= 0 ? 'black' : '#bbbbbb'
          } );
          children.push( textNode );

          (function( tRNATriplet, mRNATriplet ) {
            var createdNode = null;
            textNode.addInputListener( new SimpleDragHandler( {
              start: function( event, trail ) {

                createdNode = screenView.createTRNANode( tRNATriplet, mRNATriplet );
                screenView.worldNode.addChild( createdNode );
                createdNode.start( event, trail );
                createdNode.initialX = createdNode.x;
                createdNode.initialY = createdNode.y;
              },
              drag: function( event, trail ) {
                createdNode.drag( event, trail );
              },
              end: function( event, trail ) {
                createdNode.end( event, trail );
              }
            } ) );
          })( tRNATriplet, mRNATriplet );

          x += 65;

          if ( (index + 1) % 4 === 0 ) {
            x += 13;
          }

          if ( (index + 1) % 16 === 0 ) {
            x = 0;
            y += textNode.height;
          }

          index++;
        }
      }
    }

    Node.call( this, { children: children } );
    this.mutate( options );
  }

  proteinSynthesis.register( 'RNACodonTable', RNACodonTable );
  
  return inherit( Node, RNACodonTable, {
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
    }
  }, {
    table: table
  } );
} );