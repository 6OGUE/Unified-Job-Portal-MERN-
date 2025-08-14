import fetch from 'node-fetch';

fetch('http://localhost:5000/api/users/create-admin', { method: 'POST' })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
