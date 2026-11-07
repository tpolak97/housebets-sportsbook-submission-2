(() => {
  const rails = ['.snapRail', '.sportTrack', '.fixtureStrip', '.toolSports'];
  const selector = rails.join(',');
  let gesture = null;
  let suppressClick = false;

  function railAt(target) {
    const rail = target.closest?.(selector);
    return rail && rail.scrollWidth > rail.clientWidth + 1 ? rail : null;
  }
  function endDrag() {
    if (!gesture) return;
    const {rail, pointer, dragging} = gesture;
    gesture = null;
    rail.classList.remove('draggingRail');
    if (rail.hasPointerCapture(pointer)) rail.releasePointerCapture(pointer);
    suppressClick = dragging;
  }
  window.addEventListener('pointerdown', event => {
    suppressClick = false;
    if (!event.isPrimary || event.pointerType !== 'mouse' || event.button !== 0) return;
    const rail = railAt(event.target);
    if (rail) gesture = {rail, pointer:event.pointerId, x:event.clientX, y:event.clientY, left:rail.scrollLeft, dragging:false};
  }, true);
  window.addEventListener('pointermove', event => {
    if (!gesture || gesture.pointer !== event.pointerId) return;
    if (!(event.buttons & 1)) { endDrag(); return; }
    const dx = event.clientX - gesture.x;
    if (!gesture.dragging) {
      if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(event.clientY - gesture.y)) return;
      gesture.dragging = true;
      gesture.rail.classList.add('draggingRail');
      gesture.rail.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    gesture.rail.scrollLeft = gesture.left - dx;
  }, {capture:true, passive:false});
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    window.addEventListener(type, event => {
      if (gesture?.pointer === event.pointerId) endDrag();
    }, true);
  }
  window.addEventListener('blur', endDrag);
  window.addEventListener('dragstart', event => {
    if (gesture && railAt(event.target)) event.preventDefault();
  }, true);
  window.addEventListener('click', event => {
    if (!suppressClick || event.detail === 0) return;
    suppressClick = false;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
  document.querySelector('#app').addEventListener('wheel', event => {
    if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const rail = railAt(event.target);
    if (!rail || !event.deltaY) return;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rail.clientWidth : 1;
    const before = rail.scrollLeft;
    rail.scrollLeft += event.deltaY * unit;
    if (rail.scrollLeft !== before) event.preventDefault();
  }, {passive:false});

  // Updating a pick redraws the shell. Keep the visible card beneath the mouse.
  let previousView = null;
  const drawShell = renderPlaybookShell;
  renderPlaybookShell = function() {
    const view = [p, id, sport, league].join('/');
    const offsets = view === previousView ? rails.map(s => document.querySelector(s)?.scrollLeft) : [];
    drawShell();
    offsets.forEach((left, i) => {
      const rail = document.querySelector(rails[i]);
      if (rail && left) rail.scrollLeft = left;
    });
    previousView = view;
  };
  previousView = [p, id, sport, league].join('/');
})();
