import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

// A test pathway to ensure your API works
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: "success", message: "Finance Tracker API is alive!" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});