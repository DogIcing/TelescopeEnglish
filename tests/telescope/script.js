'use strict';
console.clear();

const sliders = {
	d_o: document.getElementById('d_o'),
	d_main: document.getElementById('d_main'),
	lf1: document.getElementById('lf1'),
	lf2: document.getElementById('lf2'),
};
const outputs = {
	d_o: document.getElementById('d_o-out'),
	d_main: document.getElementById('d_main-out'),
	lf1: document.getElementById('lf1-out'),
	lf2: document.getElementById('lf2-out'),
};
const qa = {
	d_o: sliders.d_o.value,
	d_main: sliders.d_main.value,
	lf1: sliders.lf1.value,
	lf2: sliders.lf2.value,
};
outputs.d_o.innerHTML = qa.d_o;
outputs.d_main.innerHTML = qa.d_main;
outputs.lf1.innerHTML = qa.lf1;
outputs.lf2.innerHTML = qa.lf2;

for (const [key, el] of Object.entries(sliders)) {
	el.oninput = () => {
		outputs[key].innerHTML = el.value;
		qa[key] = el.value;

		requestAnimationFrame(refreshCanvas);
	};
}

/* ~~~~~~~~~ */
/* ~~~~~~~~~ */
/* ~~~~~~~~~ */

const theme = {
	lens1: '#AAA',
	focalPoint1: '#AAA',
    lens2: '#666',
	focalPoint2: '#666',
};

const ctxS = {
	stroke: (startPoint, pointsArr, lineWidth, strokeStyle = undefined, doFill = false) => {
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		ctx.lineWidth = lineWidth;
		if (strokeStyle !== undefined) ctx.strokeStyle = strokeStyle;
		ctx.beginPath();
		ctx.moveTo(startPoint[0], startPoint[1]);
		pointsArr.forEach((point) => {
			ctx.lineTo(point[0], point[1]);
		});
		ctx.stroke();
		if (doFill) ctx.fill();
	},
	fillCirc: (center, r, fillStyle) => {
		ctx.fillStyle = fillStyle;
		ctx.lineWidth = 0;
		ctx.beginPath();
		ctx.arc(center[0], center[1], r, 0, Math.PI * 2, false);
		ctx.fill();
	},
};

/* ~~~~~~~~~ */
/* ~~~~~~~~~ */
/* ~~~~~~~~~ */

const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight * 0.7;

const cWper = canvas.width / 100;
const cHper = canvas.height / 100;
const cOunit = cWper * 0.7;

/* ~~~~~~~~~ */
/* ~~~~~~~~~ */
/* ~~~~~~~~~ */

function refreshCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// draw first lens
	ctxS.stroke(
		[(85 - qa.d_main - 3) * cWper, 10 * cHper + 3 * cWper],
		[
			[(85 - qa.d_main) * cWper, 10 * cHper],
			[(85 - qa.d_main + 3) * cWper, 10 * cHper + 3 * cWper],
		],
		cOunit,
		theme.lens1
	);
	ctxS.stroke([(85 - qa.d_main) * cWper, 10 * cHper], [[(85 - qa.d_main) * cWper, 80 * cHper]], cOunit, theme.lens1);
	ctxS.stroke(
		[(85 - qa.d_main - 3) * cWper, 80 * cHper - 3 * cWper],
		[
			[(85 - qa.d_main) * cWper, 80 * cHper],
			[(85 - qa.d_main + 3) * cWper, 80 * cHper - 3 * cWper],
		],
		cOunit,
		theme.lens1
	);
	// draw focal points of first lens
	ctxS.fillCirc([(85 - qa.d_main - +qa.lf1) * cWper, 45 * cHper], cOunit, theme.focalPoint1);
    ctxS.fillCirc([(85 - qa.d_main + +qa.lf1) * cWper, 45 * cHper], cOunit, theme.focalPoint1);

	// draw second lens
	ctxS.stroke(
		[(85 - 3) * cWper, 10 * cHper + 3 * cWper],
		[
			[85 * cWper, 10 * cHper],
			[(85 + 3) * cWper, 10 * cHper + 3 * cWper],
		],
		cOunit,
		theme.lens2
	);
	ctxS.stroke([85 * cWper, 10 * cHper], [[85 * cWper, 80 * cHper]], cOunit, theme.lens2);
	ctxS.stroke(
		[(85 - 3) * cWper, 80 * cHper - 3 * cWper],
		[
			[85 * cWper, 80 * cHper],
			[(85 + 3) * cWper, 80 * cHper - 3 * cWper],
		],
		cOunit,
		theme.lens2
	);
    // draw focal points of second lens
	ctxS.fillCirc([(85 - +qa.lf2) * cWper, 45 * cHper], cOunit, theme.focalPoint2);
    ctxS.fillCirc([(85 + +qa.lf2) * cWper, 45 * cHper], cOunit, theme.focalPoint2);

}

refreshCanvas();
