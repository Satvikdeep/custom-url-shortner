document.getElementById('urlForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form from reloading the page
  
    const originalUrl = document.getElementById('originalUrl').value;
    const alias = document.getElementById('alias').value;
    const expiryDate = document.getElementById('expiryDate').value;
  
    const payload = {
      originalUrl,
      alias,
      expiryDate: expiryDate || null
    };
  
    try {
      const response = await fetch('/url/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.status === 201) {
        document.getElementById('shortUrl').innerHTML = `<a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
        document.getElementById('result').style.display = 'block';
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  });
  