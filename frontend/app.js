const checkButton = document.querySelector('#check-api');
const statusDot = document.querySelector('#status-dot');
const statusMessage = document.querySelector('#status-message');
const statusTime = document.querySelector('#status-time');

async function checkBackend() {
  checkButton.disabled = true;
  checkButton.textContent = 'Connecting…';
  statusDot.className = 'status-dot waiting';
  statusMessage.textContent = 'Contacting the Node.js API…';
  statusTime.textContent = '';

  try {
    const response = await fetch('/api/status', {
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const responseTime = new Date(data.timestamp);

    statusDot.className = 'status-dot online';
    statusMessage.textContent = data.message;
    statusTime.textContent = `Last checked: ${responseTime.toLocaleString()}`;
    checkButton.textContent = 'Backend connected';
  } catch (error) {
    console.error(error);
    statusDot.className = 'status-dot error';
    statusMessage.textContent = 'The frontend could not reach the backend.';
    statusTime.textContent = 'Make sure the Node.js server is running.';
    checkButton.textContent = 'Try again';
  } finally {
    checkButton.disabled = false;
  }
}

checkButton.addEventListener('click', checkBackend);
