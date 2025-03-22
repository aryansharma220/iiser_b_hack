import { promises as fs } from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const electionsPath = path.join(process.cwd(), 'lib', 'elections.json');
const votersPath = path.join(process.cwd(), 'lib', 'voter.json');
const votesPath = path.join(process.cwd(), 'lib', 'votes.json');

// Configure your email transport here
const transporter = nodemailer.createTransport({
  // Use your email service configuration
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request) {
  try {
    const { electionId, type, customMessage } = await request.json();

    // Read necessary files
    const [electionsContent, votersContent, votesContent] = await Promise.all([
      fs.readFile(electionsPath, 'utf8'),
      fs.readFile(votersPath, 'utf8'),
      fs.readFile(votesPath, 'utf8')
    ]);

    const elections = JSON.parse(electionsContent);
    const voters = JSON.parse(votersContent);
    const votes = JSON.parse(votesContent);

    const election = elections.active_elections.find(e => e.id === electionId);
    if (!election) {
      return Response.json({ error: 'Election not found' }, { status: 404 });
    }

    let emailPromises = [];

    if (type === 'reminder') {
      // Filter eligible voters based on election criteria
      const eligibleVoters = voters.filter(voter => {
        const yearMatch = Array.isArray(election.eligibility.yearOfStudy)
          ? election.eligibility.yearOfStudy.includes(voter.yearOfStudy)
          : voter.yearOfStudy === election.eligibility.yearOfStudy;

        const streamMatch = !election.eligibility.stream || 
          voter.stream === election.eligibility.stream;

        return yearMatch && streamMatch && !voter.hasVoted;
      });

      // Send reminder emails
      emailPromises = eligibleVoters.map(voter => {
        const emailContent = generateReminderEmail(election, voter, customMessage);
        return sendEmail(voter.email, 'Election Reminder', emailContent);
      });

    } else if (type === 'results') {
      // Get results and send to all eligible voters
      const results = calculateResults(election, votes.votes[electionId]);
      const emailContent = generateResultsEmail(election, results, customMessage);
      
      const allVoters = voters.filter(voter => {
        const yearMatch = Array.isArray(election.eligibility.yearOfStudy)
          ? election.eligibility.yearOfStudy.includes(voter.yearOfStudy)
          : voter.yearOfStudy === election.eligibility.yearOfStudy;

        const streamMatch = !election.eligibility.stream || 
          voter.stream === election.eligibility.stream;

        return yearMatch && streamMatch;
      });

      emailPromises = allVoters.map(voter => {
        return sendEmail(voter.email, 'Election Results', emailContent);
      });
    }

    await Promise.all(emailPromises);
    return Response.json({ message: 'Notifications sent successfully' });

  } catch (error) {
    console.error('Notification error:', error);
    return Response.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}

function generateReminderEmail(election, voter, customMessage) {
  return `
    Dear ${voter.name},

    This is a reminder to cast your vote in the "${election.title}".
    
    Election Details:
    - Start Date: ${new Date(election.timeline.startDate).toLocaleString()}
    - End Date: ${new Date(election.timeline.endDate).toLocaleString()}
    
    Your Voting Credentials:
    - Voter ID: ${voter.id}
    - Passkey: ${voter.passkey}

    ${customMessage ? '\nAdditional Message:\n' + customMessage : ''}

    Please visit the voting portal to cast your vote.

    Best regards,
    Election Administration Team
  `;
}

function generateResultsEmail(election, results, customMessage) {
  let emailContent = `
    Dear Voter,

    The results for "${election.title}" have been announced.

    Results:
    ${Object.entries(results)
      .map(([position, candidates]) => `
        ${position}:
        ${Object.entries(candidates)
          .map(([name, votes]) => `- ${name}: ${votes} votes`)
          .join('\n')}
      `)
      .join('\n')}

    ${customMessage ? '\nAdditional Message:\n' + customMessage : ''}

    Best regards,
    Election Administration Team
  `;

  return emailContent;
}

async function sendEmail(to, subject, content) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: content,
  };

  return transporter.sendMail(mailOptions);
}
