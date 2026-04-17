function autoFitIpaTables() {
  const wrappers = document.querySelectorAll('.ipa-table-wrapper');

  wrappers.forEach(wrapper => {
    const table = wrapper.querySelector('.ipa-table');
    if (!table) return;

    // reset first
    table.style.transform = 'scale(1)';
    wrapper.style.height = 'auto';

    const availableWidth = wrapper.clientWidth;
    const tableWidth = table.scrollWidth;
    const tableHeight = table.offsetHeight;

    if (tableWidth > availableWidth) {
      const scaleRatio = (availableWidth / tableWidth) * 0.99;

      table.style.transformOrigin = 'top left';
      table.style.transform = `scale(${scaleRatio})`;

      // reserve the scaled space so the next section lands in the right spot
      wrapper.style.height = `${tableHeight * scaleRatio}px`;
    }
  });
}

window.addEventListener('load', autoFitIpaTables);
window.addEventListener('resize', autoFitIpaTables);
setTimeout(autoFitIpaTables, 150);