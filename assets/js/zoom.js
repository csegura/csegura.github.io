// Click a picture of a post to see it large. Esc or a click outside closes it; the arrow keys move between the pictures.
// One listener on the document: other scripts of the theme may replace the elements of a post after this one has run.
(function () {
  if (!window.HTMLDialogElement) { return; }
  var dlg = null, img, cap, links = [], index = 0;

  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.innerHTML = '<button type="button" class="lb-close" aria-label="Close">&times;</button>' +
      '<button type="button" class="lb-prev" aria-label="Previous picture">&#8249;</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button type="button" class="lb-next" aria-label="Next picture">&#8250;</button>';
    document.body.appendChild(dlg);
    img = dlg.querySelector('img');
    cap = dlg.querySelector('figcaption');
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.classList.contains('lb-close')) { dlg.close(); }
      else if (e.target.classList.contains('lb-prev')) { show(index - 1); }
      else if (e.target.classList.contains('lb-next')) { show(index + 1); }
    });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { show(index - 1); } else if (e.key === 'ArrowRight') { show(index + 1); }
    });
    dlg.addEventListener('close', function () { img.removeAttribute('src'); });
  }

  function show(n) {
    index = (n + links.length) % links.length;
    var a = links[index], thumb = a.querySelector('img');
    img.src = a.getAttribute('href');
    img.alt = thumb ? thumb.alt : '';
    cap.textContent = a.getAttribute('data-caption') || '';
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) { return; }
    var a = e.target.closest ? e.target.closest('.post a.zoom') : null;
    if (!a) { return; }
    e.preventDefault();
    if (!dlg) { build(); }
    links = Array.prototype.slice.call(document.querySelectorAll('.post a.zoom'));
    dlg.querySelector('.lb-prev').hidden = dlg.querySelector('.lb-next').hidden = links.length < 2;
    show(links.indexOf(a));
    dlg.showModal();
  });
})();
