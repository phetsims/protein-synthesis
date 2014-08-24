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

  /**
   * Constructor for the ProteinSynthesisView, it creates the bar magnet node and control panel node.
   * @param {BarMagnetModel} model the model for the entire screen
   * @constructor
   */
  function ProteinSynthesisView( model ) {

    ScreenView.call( this );

    this.addChild( new ResetAllButton( { right: this.layoutBounds.maxX - 10, bottom: this.layoutBounds.maxY - 10} ) );
  }

  return inherit( ScreenView, ProteinSynthesisView );
} );