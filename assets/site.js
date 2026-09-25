document.querySelectorAll('[data-email-brief]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const body = `Hi SZARA,\n\nName: ${data.get('name')}\nBusiness: ${data.get('business')}\nReply email: ${data.get('email')}\nHelp with: ${data.get('service')}\n\n${data.get('message')}\n`;
    const href = `mailto:harrilal20@gmail.com?subject=${encodeURIComponent('SZARA — ' + data.get('service'))}&body=${encodeURIComponent(body)}`;
    const status = form.querySelector('[role="status"]');
    status.replaceChildren();
    const link = document.createElement('a');
    link.href = href;
    link.textContent = 'Open your prepared email →';
    status.append(link, document.createElement('br'), 'Nothing has been sent yet. Review and send it in your email app. If it does not open, email harrilal20@gmail.com directly.');
    link.focus();
  });
});

