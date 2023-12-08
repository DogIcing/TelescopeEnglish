'use strict';

console.clear();

const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');

let sliders = {
	do: document.getElementById('do'),
	dmain: document.getElementById('dmain'),
	lf1: document.getElementById('lf1'),
	lf2: document.getElementById('lf2'),
};
let outputs = {
	do: document.getElementById('do-out'),
	dmain: document.getElementById('dmain-out'),
	lf1: document.getElementById('lf1-out'),
	lf2: document.getElementById('lf2-out'),
};
outputs.do.innerHTML = sliders.do.value;
outputs.dmain.innerHTML = sliders.dmain.value;
outputs.lf1.innerHTML = sliders.lf1.value;
outputs.lf2.innerHTML = sliders.lf2.value;

for (const [key, el] of Object.entries(sliders)) {
	el.oninput = () => {
		outputs[key].innerHTML = el.value;
	};
}