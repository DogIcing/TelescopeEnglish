'use strict';
console.clear();

const sliders = {
	ho: document.getElementById('ho'),
	d_o: document.getElementById('d_o'),
	d_main: document.getElementById('d_main'),
	lf1: document.getElementById('lf1'),
	lf2: document.getElementById('lf2'),
};
const outputs = {
	ho: document.getElementById('ho-out'),
	d_o: document.getElementById('d_o-out'),
	d_main: document.getElementById('d_main-out'),
	lf1: document.getElementById('lf1-out'),
	lf2: document.getElementById('lf2-out'),
};
const qa = {
	ho: sliders.ho.value,
	d_o: sliders.d_o.value,
	d_main: sliders.d_main.value,
	lf1: sliders.lf1.value,
	lf2: sliders.lf2.value,
};
outputs.ho.innerHTML = qa.ho;
outputs.d_o.innerHTML = qa.d_o;
outputs.d_main.innerHTML = qa.d_main;
outputs.lf1.innerHTML = qa.lf1;
outputs.lf2.innerHTML = qa.lf2;

for (const [key, el] of Object.entries(sliders)) {
	el.oninput = () => {
		outputs[key].innerHTML = el.value;
		if (key !== 'ho') qa[key] = el.value;
		else qa[key] = (el.value * cWper) / cHper;

		requestAnimationFrame(refreshCanvas);
	};
}

/* ~~~~~~~~~ */
/* ~~~~~~~~~ */
/* ~~~~~~~~~ */

const theme = {
	lens1: '#AAA',
	focalPoint1: '#AAA',
	centerPoint1: '#777',
	lens2: '#666',
	focalPoint2: '#666',
	centerPoint2: '#333',
	rays: '#FBB',
};

const ctxS = {
	stroke: (startPoint, pointsArr, lineWidth, strokeStyle = undefined, doFill = false) => {
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		ctx.lineWidth = Math.max(lineWidth * zoom, 1);
		if (strokeStyle !== undefined) ctx.strokeStyle = strokeStyle;
		ctx.beginPath();
		ctx.moveTo(startPoint[0] * zoom, startPoint[1] * zoom);
		pointsArr.forEach((point) => {
			ctx.lineTo(point[0] * zoom, point[1] * zoom);
		});
		ctx.stroke();
		if (doFill) ctx.fill();
	},
	fillCirc: (x, y, r, fillStyle) => {
		ctx.fillStyle = fillStyle;
		ctx.lineWidth = 0;
		ctx.beginPath();
		ctx.arc(x * zoom, y * zoom, r * zoom, 0, Math.PI * 2, false);
		ctx.fill();
	},
	fillText: (text = 'DEFAULT TEXT', fillStyle = '#000', fontSize = 36, x = 0, y = 0) => {
		ctx.font = `${fontSize * zoom}px Commissioner`;
		ctx.fillStyle = fillStyle;

		let boundingBox = ctx.measureText(text);
		ctx.fillText(text, (x - boundingBox.width / 2) * zoom, (y + boundingBox.actualBoundingBoxAscent + boundingBox.actualBoundingBoxDescent) * zoom);
	},
};

/* ~~~~~~~~~ */
/* ~~~~~~~~~ */
/* ~~~~~~~~~ */

const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');

const cWper = innerWidth / 100;
const cHper = Math.max(innerHeight - document.getElementById('mo').offsetHeight - 40, innerWidth / 3) / 100;
const cOunit = cWper * 0.7;

canvas.style.width = innerWidth - 20 + 'px';
canvas.style.height = cHper * 100 + 'px';

const dpi = window.devicePixelRatio;
canvas.width = cWper * 100 * dpi;
canvas.height = cHper * 100 * dpi;

ctx.scale(dpi, dpi);
ctx.translate(cWper * 50, cHper * 50);

let zoom = 1;
canvas.addEventListener(
	'wheel',
	(e) => {
		zoom -= 0.1 * Math.sign(e.deltaY);
		zoom = Math.min(Math.max(0.1, zoom), 1.5);
		refreshCanvas();
	},
	{ passive: true }
);
canvas.addEventListener(
	'touchstart',
	(e) => {
		if (e.targetTouches.length == 2) {
			const oTouch1 = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
			const oTouch2 = { x: e.targetTouches[1].clientX, y: e.targetTouches[1].clientY };
			const oDis = Math.sqrt((oTouch1.x - oTouch2.x) ** 2 + (oTouch1.y - oTouch2.y) ** 2);
			const oZoom = zoom;

			function onTouchMove(e) {
				if (e.targetTouches.length != 2) onTouchEnd();
				const touch1 = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
				const touch2 = { x: e.targetTouches[1].clientX, y: e.targetTouches[1].clientY };
				const dis = Math.sqrt((touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2);

				zoom = oZoom + (dis - oDis) / 128;
				zoom = Math.min(Math.max(0.1, zoom), 1.5);

				refreshCanvas();
			}
			function onTouchEnd() {
				removeEventListener('touchmove', onTouchMove);
				removeEventListener('touchend', onTouchEnd);
			}

			addEventListener('touchmove', onTouchMove);
			addEventListener('touchend', onTouchEnd);
		}
	},
	{ passive: true }
);
/*
canvas.addEventListener('touchmove', function (event) {
	if (event.targetTouches.length == 2) {
		//console.log(event);
		addEventListener('touchend', () => {
			console.log(123);
		});
	}
});

/* ~~~~~~~~~ */
/* ~~~~~~~~~ */
/* ~~~~~~~~~ */

function refreshCanvas() {
	ctx.save();
	ctx.translate(-cWper * 50, -cHper * 50);
	ctx.clearRect(0, 0, cWper * 100, cHper * 100);
	ctx.restore();

	telescope();
	rays();
	images();
}

function telescope() {
	/* ~~~ SECTION 1: COMPONENTS OF THE TELESCOPE ~~~ */
	// draw first lens
	ctxS.stroke(
		[(35 - qa.d_main - 3) * cWper, -40 * cHper + 3 * cWper],
		[
			[(35 - qa.d_main) * cWper, -40 * cHper],
			[(35 - qa.d_main + 3) * cWper, -40 * cHper + 3 * cWper],
		],
		cOunit,
		theme.lens1
	);
	ctxS.stroke([(35 - qa.d_main) * cWper, -1000 * cHper], [[(35 - qa.d_main) * cWper, 1000 * cHper]], cOunit, theme.lens1);
	ctxS.stroke(
		[(35 - qa.d_main - 3) * cWper, 40 * cHper - 3 * cWper],
		[
			[(35 - qa.d_main) * cWper, 40 * cHper],
			[(35 - qa.d_main + 3) * cWper, 40 * cHper - 3 * cWper],
		],
		cOunit,
		theme.lens1
	);
	ctxS.fillText('objectif', theme.lens1, 2.5 * cOunit, (35 - qa.d_main) * cWper, 42 * cHper);

	// draw second lens
	ctxS.stroke(
		[(35 - 3) * cWper, -40 * cHper + 3 * cWper],
		[
			[35 * cWper, -40 * cHper],
			[(35 + 3) * cWper, -40 * cHper + 3 * cWper],
		],
		cOunit,
		theme.lens2
	);
	ctxS.stroke([35 * cWper, -1000 * cHper], [[35 * cWper, 1000 * cHper]], cOunit, theme.lens2);
	ctxS.stroke(
		[(35 - 3) * cWper, 40 * cHper - 3 * cWper],
		[
			[35 * cWper, 40 * cHper],
			[(35 + 3) * cWper, 40 * cHper - 3 * cWper],
		],
		cOunit,
		theme.lens2
	);
	ctxS.fillText('oculaire', theme.lens2, 2.5 * cOunit, 35 * cWper, 42 * cHper);

	// draw key points of first lens
	ctxS.fillCirc((35 - qa.d_main - +qa.lf1) * cWper, 0 * cHper, 0.5 * cOunit, theme.focalPoint1);
	ctxS.fillText("F'", theme.focalPoint1, 2.5 * cOunit, (35 - qa.d_main - +qa.lf1) * cWper, 1.75 * cHper);
	ctxS.fillCirc((35 - qa.d_main + +qa.lf1) * cWper, 0 * cHper, 0.5 * cOunit, theme.focalPoint1);
	ctxS.fillText('F', theme.focalPoint1, 2.5 * cOunit, (35 - qa.d_main + +qa.lf1) * cWper, 1.75 * cHper);
	ctxS.fillCirc((35 - qa.d_main) * cWper, 0 * cHper, 0.5 * cOunit, theme.centerPoint1);
	ctxS.fillText('C', theme.centerPoint1, 2.5 * cOunit, (35 - qa.d_main) * cWper, 1.75 * cHper);

	// draw key points of second lens
	ctxS.fillCirc((35 - +qa.lf2) * cWper, 0 * cHper, 0.5 * cOunit, theme.focalPoint2);
	ctxS.fillText("F'", theme.focalPoint2, 2.5 * cOunit, (35 - +qa.lf2) * cWper, 1.75 * cHper);
	ctxS.fillCirc((35 + +qa.lf2) * cWper, 0 * cHper, 0.5 * cOunit, theme.focalPoint2);
	ctxS.fillText('F', theme.focalPoint2, 2.5 * cOunit, (35 + +qa.lf2) * cWper, 1.75 * cHper);
	ctxS.fillCirc(35 * cWper, 0 * cHper, 0.5 * cOunit, theme.centerPoint2);
	ctxS.fillText('C', theme.centerPoint2, 2.5 * cOunit, 35 * cWper, 1.75 * cHper);
}

function rays() {
	/* ~~~ SECTION 2: RAYS COMING FROM THE OBSERVED OBJECT ~~~ */
	const objectPos = [35 - qa.d_main - qa.d_o * 100, -qa.ho];
	const di = (qa.d_o * 100 * qa.lf1) / (qa.d_o * 100 - qa.lf1);
	const image1Pos = [di + (35 - qa.d_main), (qa.ho * di) / (qa.d_o * 100)];

	// first principle ray
	ctxS.stroke([objectPos[0] * cWper, objectPos[1] * cHper], [[image1Pos[0] * cWper, image1Pos[1] * cHper]], 0.25 * cOunit, theme.rays);
	// second principle ray
	ctxS.stroke(
		[objectPos[0] * cWper, objectPos[1] * cHper],
		[
			[(35 - qa.d_main) * cWper, objectPos[1] * cHper],
			[image1Pos[0] * cWper, image1Pos[1] * cHper],
		],
		0.25 * cOunit,
		theme.rays
	);
	// third principle ray
	ctxS.stroke(
		[objectPos[0] * cWper, objectPos[1] * cHper],
		[
			[(35 - qa.d_main) * cWper, image1Pos[1] * cHper],
			[image1Pos[0] * cWper, image1Pos[1] * cHper],
		],
		0.25 * cOunit,
		theme.rays
	);

	// end
}

function images() {
	/* ~~~ SECTION 3: IMAGES OF THE OBJECT CREATED BY THE TWO LENSES ~~~ */
}

refreshCanvas();
