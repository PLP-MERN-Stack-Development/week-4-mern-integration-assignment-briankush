## CORS Configuration

To fix CORS errors between your frontend and backend servers, update your Express.js server configuration:

```javascript
// In your server.js or app.js file
const cors = require('cors');

// Replace this:
app.use(cors());

// With this:
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Make sure to install the cors package:
```
npm install cors
```
