const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();
// Use the environment variable for port or fallback to 3001 locally
const port = process.env.PORT || 3001;  // Vercel uses dynamic port

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Route to handle SLA penalties submission
app.post('/submit-penalty', (req, res) => {
  const penaltyData = req.body;

  penaltyData.forEach(entry => {
    const { project, slaBreach, penaltyAmount, issues } = entry;

    // Loop through each issue and calculate penalty
    let totalCases = issues.reduce((sum, issue) => sum + issue.caseCount, 0);
    let perCasePenalty = totalCases ? penaltyAmount / totalCases : 0;

    issues.forEach(issue => {
      const { issueType, caseCount } = issue;
      const issuePenalty = perCasePenalty * caseCount;

      // Log penalty calculations (no database, just logging for now)
      console.log(`Project: ${project}, SLA Breach: ${slaBreach}, Issue: ${issueType}, Total Penalty: ${issuePenalty}`);
    });
  });

  res.json({ message: 'Penalty data submitted successfully.' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
