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
const chart = {
	oi: document.getElementById('oi-out'),
	hi: document.getElementById('hi-out'),
	gr: document.getElementById('gr-out'),
	interVisi: document.getElementById('interVisi-out'),
};
const qa = {
	ho: sliders.ho.value,
	d_o: sliders.d_o.value,
	d_main: sliders.d_main.value,
	lf1: sliders.lf1.value,
	lf2: sliders.lf2.value,
};
outputs.ho.value = qa.ho;
outputs.d_o.value = qa.d_o;
outputs.d_main.value = qa.d_main;
outputs.lf1.value = qa.lf1;
outputs.lf2.value = qa.lf2;

for (const [key, el] of Object.entries(sliders)) {
	el.oninput = () => {
		outputs[key].value = el.value;
		if (key !== 'ho') qa[key] = el.value;
		else qa[key] = (el.value * cWper) / cHper;

		requestAnimationFrame(refreshCanvas);
	};
}
for (const [key, el] of Object.entries(outputs)) {
	el.oninput = () => {
		sliders[key].value = el.value;
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
	rays1: '#FBB',
	rays2: '#6AA',
	object: '#09c',
};

const ctxS = {
	stroke: (startPoint, pointsArr, lineWidth, strokeStyle, lineDash = []) => {
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		ctx.lineWidth = Math.max(lineWidth * zoom, 1);
		ctx.strokeStyle = strokeStyle;
		ctx.setLineDash(lineDash);
		ctx.beginPath();
		ctx.moveTo((startPoint[0] - mapShift.x) * zoom, (startPoint[1] - mapShift.y) * zoom);
		pointsArr.forEach((point) => {
			ctx.lineTo((point[0] - mapShift.x) * zoom, (point[1] - mapShift.y) * zoom);
		});
		ctx.stroke();
	},
	fillCirc: (x, y, r, fillStyle) => {
		ctx.fillStyle = fillStyle;
		ctx.lineWidth = 0;
		ctx.beginPath();
		ctx.arc((x - mapShift.x) * zoom, (y - mapShift.y) * zoom, r * zoom, 0, Math.PI * 2, false);
		ctx.fill();
	},
	fillText: (text = 'DEFAULT TEXT', fillStyle = '#000', fontSize = 36, x = 0, y = 0) => {
		ctx.font = `${fontSize * zoom}px Commissioner`;
		ctx.fillStyle = fillStyle;

		let boundingBox = ctx.measureText(text);
		ctx.fillText(text, (x - boundingBox.width / 2 - mapShift.x) * zoom, (y + boundingBox.actualBoundingBoxAscent + boundingBox.actualBoundingBoxDescent - mapShift.y) * zoom);
	},
};

/* ~~~~~~~~~ */
/* ~~~~~~~~~ */
/* ~~~~~~~~~ */

const canvas = document.getElementsByTagName('canvas')[0];
const canvasCover = document.getElementById('canvas-cover');
const ctx = canvas.getContext('2d');

const cWper = innerWidth / 100;
const cHper = Math.max(innerHeight - document.getElementById('mo').offsetHeight - 50, innerWidth / 3) / 100;
const cOunit = cWper * 0.7;

canvas.style.width = innerWidth - 20 + 'px';
canvasCover.style.width = innerWidth - 20 + 'px';
canvas.style.height = cHper * 100 + 'px';
canvasCover.style.height = cHper * 100 + 'px';

const dpi = window.devicePixelRatio;
canvas.width = cWper * 100 * dpi;
canvas.height = cHper * 100 * dpi;

ctx.scale(dpi, dpi);
ctx.translate(cWper * 50, cHper * 50);

let zoom = 1;
let mapShift = { x: 0, y: 0 };
canvas.addEventListener(
	'wheel',
	(e) => {
		zoom -= 0.15 * Math.sign(e.deltaY);
		zoom = Math.min(Math.max(0.05, zoom), 1.5);
		refreshCanvas();
	},
	{ passive: true }
);
canvas.addEventListener('mousedown', (e) => {
	let oTouch = { x: e.clientX, y: e.clientY };

	function onMouseMove(e) {
		mapShift.x += (oTouch.x - e.clientX) / zoom;
		mapShift.y += (oTouch.y - e.clientY) / zoom;
		mapShift.x = Math.max(Math.min(mapShift.x, 4000), -4000);
		mapShift.y = Math.max(Math.min(mapShift.y, 4000), -4000);

		oTouch = { x: e.clientX, y: e.clientY };

		refreshCanvas();
	}
	function onMouseUp() {
		removeEventListener('mousemove', onMouseMove);
		removeEventListener('mouseup', onMouseUp);
	}
	addEventListener('mousemove', onMouseMove);
	addEventListener('mouseup', onMouseUp);
});
canvas.addEventListener(
	'touchstart',
	(e) => {
		if (e.targetTouches.length == 1) {
			let oTouch = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };

			function onTouchMove(e) {
				mapShift.x += (oTouch.x - e.targetTouches[0].clientX) / zoom;
				mapShift.y += (oTouch.y - e.targetTouches[0].clientY) / zoom;
				mapShift.x = Math.max(Math.min(mapShift.x, 4000), -4000);
				mapShift.y = Math.max(Math.min(mapShift.y, 4000), -4000);

				oTouch = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };

				refreshCanvas();
			}
			function onTouchEnd() {
				removeEventListener('touchmove', onTouchMove);
				removeEventListener('touchend', onTouchEnd);
			}

			addEventListener('touchmove', onTouchMove);
			addEventListener('touchend', onTouchEnd);
		} else if (e.targetTouches.length == 2) {
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

canvasCover.addEventListener('click', removeCanvasCover);
canvasCover.addEventListener('touchstart', removeCanvasCover, { passive: true });
function removeCanvasCover() {
	canvasCover.style.opacity = 0;
	setTimeout(() => {
		canvasCover.remove();
	}, 500);

	removeEventListener('click', removeCanvasCover);
	removeEventListener('touchstart', removeCanvasCover);
}

/* ~~~~~~~~~ */
/* ~~~~~~~~~ */
/* ~~~~~~~~~ */

function refreshCanvas() {
	ctx.save();
	ctx.translate(-cWper * 50, -cHper * 50);
	ctx.clearRect(0, 0, cWper * 100, cHper * 100);
	ctx.restore();

	telescope();
	let [objectPos, image1Pos, image2Pos] = rays();
	images(objectPos, image1Pos, image2Pos);

	updateResultsChart(objectPos, image2Pos);
}

function telescope() {
	/* ~~~ SECTION 1: COMPONENTS OF THE TELESCOPE ~~~ */
	// draw horizon
	ctxS.stroke([-20000, 0], [[20000, 0]], 0.2 * cOunit, '#000');

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
	ctxS.fillText('objectif', '#000', 2.5 * cOunit, (35 - qa.d_main) * cWper, 42 * cHper);

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
	ctxS.fillText('oculaire', '#000', 2.5 * cOunit, 35 * cWper, 42 * cHper);

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

	// FIRST GROUP OF PRINCIPLE RAYS
	const objectPos = { x: 35 - qa.d_main - qa.d_o * 100, y: -qa.ho };
	const di1 = (qa.d_o * 100 * qa.lf1) / (qa.d_o * 100 - qa.lf1);
	const image1Pos = { x: di1 + (35 - qa.d_main), y: (qa.ho * di1) / (qa.d_o * 100) };
	const isBetween = image1Pos.x < 35;
	// first principle ray
	if (isBetween) {
		ctxS.stroke([objectPos.x * cWper, objectPos.y * cHper], [[image1Pos.x * cWper, image1Pos.y * cHper]], 0.25 * cOunit, theme.rays1);
	} else {
		const m = (image1Pos.y * cHper - objectPos.y * cHper) / (image1Pos.x * cWper - objectPos.x * cWper);
		ctxS.stroke([objectPos.x * cWper, objectPos.y * cHper], [[35 * cWper, qa.d_main * cWper * m]], 0.25 * cOunit, theme.rays1);
	}
	// second principle ray
	if (isBetween) {
		ctxS.stroke(
			[objectPos.x * cWper, objectPos.y * cHper],
			[
				[(35 - qa.d_main) * cWper, objectPos.y * cHper],
				[image1Pos.x * cWper, image1Pos.y * cHper],
			],
			0.25 * cOunit,
			theme.rays1
		);
	} else {
		const m = (image1Pos.y * cHper - objectPos.y * cHper) / (image1Pos.x * cWper - (35 - qa.d_main) * cWper);
		const h = image1Pos.x * cWper - (image1Pos.y * cHper) / m;

		ctxS.stroke(
			[objectPos.x * cWper, objectPos.y * cHper],
			[
				[(35 - qa.d_main) * cWper, objectPos.y * cHper],
				[35 * cWper, (35 * cWper - h) * m],
			],
			0.25 * cOunit,
			theme.rays1
		);
	}
	// third principle ray
	if (isBetween) {
		ctxS.stroke(
			[objectPos.x * cWper, objectPos.y * cHper],
			[
				[(35 - qa.d_main) * cWper, image1Pos.y * cHper],
				[image1Pos.x * cWper, image1Pos.y * cHper],
			],
			0.25 * cOunit,
			theme.rays1
		);
	} else {
		ctxS.stroke(
			[objectPos.x * cWper, objectPos.y * cHper],
			[
				[(35 - qa.d_main) * cWper, image1Pos.y * cHper],
				[35 * cWper, image1Pos.y * cHper],
			],
			0.25 * cOunit,
			theme.rays1
		);
	}

	// SECOND GROUP OF PRINCIPLE RAYS
	if (isBetween) {
		// only draw if first image is between the first and second lens
		const di2 = ((qa.d_main - di1) * qa.lf2) / (qa.d_main - di1 - qa.lf2);
		const image2Pos = { x: di2 + 35, y: -(image1Pos.y * di2) / (qa.d_main - di1) };
		// first principle ray
		ctxS.stroke([image1Pos.x * cWper, image1Pos.y * cHper], [[(image1Pos.x + 100 * Math.abs(image1Pos.x - image2Pos.x)) * cWper, (image1Pos.y - 100 * Math.abs(image1Pos.y - image2Pos.y)) * cHper]], 0.25 * cOunit, theme.rays2);
		ctxS.stroke([image1Pos.x * cWper, image1Pos.y * cHper], [[image2Pos.x * cWper, image2Pos.y * cHper]], 0.25 * cOunit, theme.rays2, [8, 6]);
		// second principle ray
		ctxS.stroke(
			[image1Pos.x * cWper, image1Pos.y * cHper],
			[
				[35 * cWper, image1Pos.y * cHper],
				[(image1Pos.x + 100 * Math.abs(35 - image2Pos.x)) * cWper, (image1Pos.y - 100 * Math.abs(image1Pos.y - image2Pos.y)) * cHper],
			],
			0.25 * cOunit,
			theme.rays2
		);
		ctxS.stroke([35 * cWper, image1Pos.y * cHper], [[image2Pos.x * cWper, image2Pos.y * cHper]], 0.25 * cOunit, theme.rays2, [8, 6]);
		// third principle ray
		ctxS.stroke(
			[image1Pos.x * cWper, image1Pos.y * cHper],
			[
				[35 * cWper, image2Pos.y * cHper],
				[1000 * cWper, image2Pos.y * cHper],
			],
			0.25 * cOunit,
			theme.rays2
		);
		ctxS.stroke([35 * cWper, image2Pos.y * cHper], [[image2Pos.x * cWper, image2Pos.y * cHper]], 0.25 * cOunit, theme.rays2, [8, 6]);

		return [objectPos, image1Pos, image2Pos];
	}

	return [objectPos];
}

function images(objectPos, image1Pos, image2Pos) {
	/* ~~~ SECTION 3: IMAGES OF THE OBJECT CREATED BY THE TWO LENSES ~~~ */
	[objectPos, image1Pos, image2Pos].forEach((el, i) => {
		if (el !== undefined) {
			ctxS.stroke(
				[(el.x - 1.5) * cWper, el.y * cHper + 2 * cWper * (el.y < 0 ? 1 : -1)],
				[
					[el.x * cWper, el.y * cHper],
					[(el.x + 1.5) * cWper, el.y * cHper + 2 * cWper * (el.y < 0 ? 1 : -1)],
				],
				cOunit,
				theme.object + (i == 2 ? '' : '5')
			);
			ctxS.stroke([el.x * cWper, el.y * cHper], [[el.x * cWper, 0]], cOunit, theme.object + (i == 2 ? '' : '5'));
		}
	});
}

function updateResultsChart(objectPos, image2Pos) {
	if (image2Pos !== undefined && isFinite(image2Pos.x)) {
		chart.oi.innerHTML = Math.abs(image2Pos.x - 35).toFixed(2);
		chart.hi.innerHTML = Math.abs(image2Pos.y).toFixed(2);

		const beta = (image2Pos.y * (objectPos.x - 35)) / (image2Pos.x - 35);
		chart.gr.innerHTML = (Math.abs(beta / objectPos.y) * Math.sign(image2Pos.y * objectPos.y)).toFixed(2);
	} else {
		chart.oi.innerHTML = '- ';
		chart.hi.innerHTML = '- ';
		chart.gr.innerHTML = '- ';
		chart.interVisi.innerHTML = `\u2204 `;
	}

	const v1 = (qa.d_main * qa.lf1) / (qa.d_main - qa.lf1) / 100;
	const v2 = ((qa.d_main - qa.lf2) * qa.lf1) / (qa.d_main - qa.lf2 - qa.lf1) / 100;
	if (Math.max(v1, v2) <= 0) chart.interVisi.innerHTML = `\u2204 `;
	else {
		if (35 - qa.d_main + qa.lf1 > 35 - qa.lf2) {
			if (isFinite(Math.max(v1, v2))) chart.interVisi.innerHTML = `]${Math.max(v1, v2).toFixed(2)}, Infinty[ `;
			else chart.interVisi.innerHTML = `\u2204 `;
		} else chart.interVisi.innerHTML = `]${Math.max(Math.min(v1, v2), -100000).toFixed(2)}, ${Math.max(Math.max(v1, v2), -100000).toFixed(2)}[ `;
	}
}

refreshCanvas();
