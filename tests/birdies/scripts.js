'use strict';

const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

let cellMap = [];
for (let i = 0; i < Math.ceil(canvas.height / 64) + 2; i++) {
	cellMap.push([]);
	for (let j = 0; j < Math.ceil(canvas.width / 64) + 2; j++) {
		cellMap[i].push([]);
	}
}

let birdies = [];
for (let i = 0; i < 10; i++) {
	birdies.push({
		x: 0,
		y: 0,
		gx: 0,
		gy: 0,
		a: 0,
		s: 0,
	});
}

console.log(birdies)