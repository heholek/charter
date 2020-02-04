"use strict";

const fs = require( "fs" ).promises;
const hb = require( "handlebars" );
const path = require( "path" );
let _template;

async function getChartTemplate() {
	if ( !_template ) {
		const text = await fs.readFile( path.join( __dirname, "chart.hbs" ), "utf8" );
		_template = hb.compile( text );
	}
	return _template;
}

function renderChart( chart, options ) {
	const header = [];
	const body = [];
	const footer = [];

	if ( chart.title ) {
		header.push( `<h1 class="charter-title">${ chart.title }</h1>` );
	}
	if ( chart.artist ) {
		header.push( `<h2 class="charter-artist">${ chart.artist }</h2>` );
	}
	if ( chart.subtitle ) {
		header.push( `<h2 class="charter-subtitle">${ chart.subtitle }</h2>` );
	}

	const keyLine = [];
	if ( chart.key ) {
		keyLine.push( `Key: ${ chart.key }` );
	}
	if ( chart.tempo ) {
		keyLine.push( `Tempo: ${ chart.tempo }` );
	}
	if ( chart.time ) {
		keyLine.push( `Time: ${ chart.time }` );
	}
	if ( keyLine.length > 0 ) {
		header.push( `<h2 class="charter-key">${ keyLine.join( " | " ) }</h2>` );
	}

	chart.sections.forEach( section => {
		body.push( "<div class=\"charter-section\">" );
		body.push( `<div class="charter-section-title">${ section.title }</div>` );
		body.push( "<div class=\"charter-section-body\">" );
		for( let i = 0; i < section.chords.length; i++ ) {
			body.push( "<table class=\"charter-chart\">" );
			body.push( "<tr class=\"charter-chords\">" );
			for( let j = 0; j < section.chords[i].length; j++ ){
				body.push( section.chords[i][j].startsWith( "(" ) ? `<td class="charter-comment">${ section.chords[i][j] }</td>` : `<td class="charter-chord">${ section.chords[i][j] }</td>` );
			}
			body.push( "</tr>" );
			body.push( "<tr class=\"charter-lyrics\">" );
			for( let j = 0; j < section.lyrics[i].length; j++ ){
				body.push( `<td class="charter-lyric">${ section.lyrics[i][j] }</td>` );
			}
			body.push( "</tr>" );
			body.push( "</table>" );
		}
		body.push( "</div>" ); // section body
		body.push( "</div>" ); // section

	} );

	if ( chart.footer.length > 0 ) {
		footer.push( "<div class=\"charter-footer\">" );
		chart.footer.forEach( f => {
			footer.push( `<div class="charter-footer-line">${ f }</div>` );
		} );
		footer.push( "</div>" );
	}
	chart.footer.forEach;

	return {
		header: header.join( "\n" ),
		body: body.join( "\n" ),
		footer: footer.join( "\n" )
	};
}

async function render( chart ) {
	const template = await getChartTemplate();
	const chartHtml = renderChart( chart );
	return template( chartHtml );
}

module.exports = {
	render,
	renderChart
};