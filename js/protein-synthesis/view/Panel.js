// Copyright 2014-2017, University of Colorado Boulder

/**
 *
 * TODO: contribute back to sun, if changes seem good.
 *
 * Control panel around a content node.
 * Dynamically adjusts its size to fit its contents.
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var proteinSynthesis = require( 'PROTEIN_SYNTHESIS/proteinSynthesis' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Node} content
   * @param {Object} [options]
   * @constructor
   */
  function Panel( content, options ) {

    var self = this;

    // default options
    options = _.extend( {
      fill: 'white',
      stroke: 'black',
      lineWidth: 1, // width of the background border
      xMargin: 5,
      yMargin: 5,
      cornerRadius: 10, // radius of the rounded corners on the background
      resize: true, // dynamically resize when content bounds change
      backgroundPickable: false
    }, options );

    Node.call( self );

    // correct size will be set by updateBackground
    var background = new Rectangle( 0, 0, 1, 1, {
      stroke: options.stroke,
      lineWidth: options.lineWidth,
      fill: options.fill,
      pickable: options.backgroundPickable,
      lineDash: options.lineDash,
      cornerRadius: options.cornerRadius
    } );
    this.background = background;
    this.addChild( background );
    this.addChild( content );

    // Adjust the background size to match the content.
    var updateBackground = function() {
      background.setRect( 0, 0, content.width + ( 2 * options.xMargin ), content.height + ( 2 * options.yMargin ) );

      // Prevent oscillation and stack overflow due to numerical imprecision, see https://github.com/phetsims/sun/issues/110
      if ( background.center.distanceSquared( content.center ) > 1E-6 ) {
        content.center = background.center;
      }
    };
    if ( options.resize ) {
      content.on( 'bounds', function() {
        updateBackground();
      } );
    }
    updateBackground();

    // Apply options after the layout is done, so that options that use the bounds will work properly.
    this.mutate( options );
  }

  proteinSynthesis.register( 'Panel', Panel );

  return inherit( Node, Panel, {

    //Setters for the background rectangle stroke
    set stroke( s ) { this.background.stroke = s; },

    //Getter for the background rectangle stroke
    get stroke() {return this.background.stroke;},

    set lineWidth( a ) {this.background.lineWidth = a;},

    get lineWidth() {return this.background.lineWidth;},

    set fill( a ) {this.background.fill = a;},

    get fill() {return this.background.fill;}
  } );
} );