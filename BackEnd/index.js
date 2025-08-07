const express = require('express')
const urlRoute = require('./routes/url')
const connecToMongoDB = require('./connect')
const URL = require('./models/url')
const cors = require('cors');
const app = express()

const PORT = 8001;

connecToMongoDB('mongodb://localhost:27017/short-url')
.then(() => {
    console.log("Connected to MongoDB");
})

app.use(express.json())
app.use(cors());

app.use("/url", urlRoute)
app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: new Date(),
                },
            },
        }
    );

    if (!entry) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(entry.redirectUrl);
});




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    });