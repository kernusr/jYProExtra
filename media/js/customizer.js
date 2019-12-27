/*
 * @package    jYProExtra System Plugin
 * @version    __DEPLOY_VERSION__
 * @author     Septdir Workshop - www.septdir.com
 * @copyright  Copyright (c) 2018 - 2019 Septdir Workshop. All rights reserved.
 * @license    GNU/GPL license: https://www.gnu.org/copyleft/gpl.html
 * @link       https://www.septdir.com/
 */

function jYProExtraModal(requestUrl) {
	let request = new XMLHttpRequest(),
		formData = new FormData();

	request.open('POST', requestUrl);
	request.send(formData);
	request.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			let response = false;
			try {
				response = JSON.parse(this.response);
			} catch (e) {
				response = false;
				console.error(e.message);
				return;
			}
			if (response.success) {

				// Add modal
				let content = document.createElement('div');
				content.innerHTML = response.data[0].content;
				document.querySelector('body').appendChild(content.firstChild);

				// Add button
				let header = document.querySelector('.yo-sidebar-header .yo-sidebar-close'),
					button = document.createElement('div');
				button.innerHTML = response.data[0].button;
				header.classList.add('uk-flex-between');
				header.appendChild(button.firstChild);

				// Modal actions
				let modal = document.querySelector('#jYProExtraModal'),
					iframe = modal.querySelector('iframe');
				UIkit.util.on('#jYProExtraModal', 'show', function () {
					iframe.setAttribute('src', iframe.getAttribute('data-src'));
				});
				UIkit.util.on('#jYProExtraModal', 'hide', function () {
					iframe.removeAttribute('src');
				});

				// Iframe actions
				let iframeSave = false;
				iframe.addEventListener('load', function () {
					let saveButton = iframe.contentWindow.document.body.querySelector('#applyBtn');
					if (saveButton) {
						modal.querySelector('button[type="button"]').addEventListener('click', function (event) {
							event.preventDefault();
							saveButton.dispatchEvent(new Event('click'));
							iframeSave = true;
						});
					}
					if (iframeSave) {
						let preview = document.querySelector('iframe[name="preview-1"]');
						preview.contentWindow.location = preview.contentWindow.location;
						iframeSave = false;
					}
				});

			} else {
				console.error(response.message);
			}
		} else if (this.readyState === 4 && this.status !== 200) {
			console.error(request.status + ' ' + request.message);
		}
	};
}