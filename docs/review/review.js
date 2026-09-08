/* Responses stay in memory and are exported only at the reviewer's request. */
const form = document.getElementById('review');
const status = document.getElementById('status');
document.getElementById('download').addEventListener('click', () => {
  const fields = Array.from(form.elements).filter(field => field.name);
  const responses = fields.map(field => {
    const label = field.labels?.[0]?.textContent || field.name;
    return `${label}\n${field.value.trim() || '[No response]'}\n`;
  }).join('\n');
  const blob = new Blob([`DAVID EDMONDS PORTFOLIO REVIEW\nSelf-reported responses\n\n${responses}`], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'portfolio-review-responses.txt';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = 'Download requested. Check your downloads, then send the file back. Nothing has been submitted.';
});
document.getElementById('clear').addEventListener('click', () => {
  if (window.confirm('Clear all answers? Download them first if you want to keep a copy.')) {
    form.reset();
    status.textContent = 'Answers cleared.';
  }
});
form.addEventListener('submit', event => event.preventDefault());
