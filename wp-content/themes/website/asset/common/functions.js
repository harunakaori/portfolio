// JavaScript Document

/*
	Standards Compliant Rollover Script
	Author : Daniel Nolan
	http://www.bleedingego.co.uk/webdev.php
*/

function initRollovers() {
	if (!document.getElementById) return

	var aPreLoad = new Array();
	var sTempSrc;
	var aImages = document.getElementsByTagName('img');

	for (var i = 0; i < aImages.length; i++) {
		if (aImages[i].className == 'imgover') {
			var src = aImages[i].getAttribute('src');
			var ftype = src.substring(src.lastIndexOf('.'), src.length);
			var hsrc = src.replace(ftype, '_o' + ftype);

			aImages[i].setAttribute('hsrc', hsrc);

			aPreLoad[i] = new Image();
			aPreLoad[i].src = hsrc;

			aImages[i].onmouseover = function () {
				sTempSrc = this.getAttribute('src');
				this.setAttribute('src', this.getAttribute('hsrc'));
			}

			aImages[i].onmouseout = function () {
				if (!sTempSrc) sTempSrc = this.getAttribute('src').replace('_o' + ftype, ftype);
				this.setAttribute('src', sTempSrc);
			}
		}
	}
}

window.onload = initRollovers;


//ロールオーバー
function MM_preloadImages() { //v3.0
	var d = document; if (d.images) {
		if (!d.MM_p) d.MM_p = new Array();
		var i, j = d.MM_p.length, a = MM_preloadImages.arguments; for (i = 0; i < a.length; i++)
			if (a[i].indexOf("#") != 0) { d.MM_p[j] = new Image; d.MM_p[j++].src = a[i]; }
	}
}

function MM_swapImgRestore() { //v3.0
	var i, x, a = document.MM_sr; for (i = 0; a && i < a.length && (x = a[i]) && x.oSrc; i++) x.src = x.oSrc;
}

function MM_findObj(n, d) { //v4.01
	var p, i, x; if (!d) d = document; if ((p = n.indexOf("?")) > 0 && parent.frames.length) {
		d = parent.frames[n.substring(p + 1)].document; n = n.substring(0, p);
	}
	if (!(x = d[n]) && d.all) x = d.all[n]; for (i = 0; !x && i < d.forms.length; i++) x = d.forms[i][n];
	for (i = 0; !x && d.layers && i < d.layers.length; i++) x = MM_findObj(n, d.layers[i].document);
	if (!x && d.getElementById) x = d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
	var i, j = 0, x, a = MM_swapImage.arguments; document.MM_sr = new Array; for (i = 0; i < (a.length - 2); i += 3)
		if ((x = MM_findObj(a[i])) != null) { document.MM_sr[j++] = x; if (!x.oSrc) x.oSrc = x.src; x.src = a[i + 2]; }
}


//ポップアップ(スクロールバーあり)
function open_pop(url, disp_width, disp_height) {
	window.open(url, 'topics', 'width=' + disp_width + ',height=' + disp_height + ',scrollbars=yes');
}


(function () {
	const btn = document.getElementById('menuBtn');
	const mobileNav = document.getElementById('mobile-nav');
	btn.addEventListener('click', () => {
		const open = mobileNav.classList.toggle('open');
		btn.setAttribute('aria-expanded', String(open));
	});
})();