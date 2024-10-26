const express = require('express');
const cors = require('cors');
const botRoutes = require('./routes/botRoutes');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', botRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
