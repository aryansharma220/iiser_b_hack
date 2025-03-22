import { promises as fs } from 'fs';
import path from 'path';

const votesPath = path.join(process.cwd(), 'lib', 'votes.json');

export async function POST(request) {
  try {
    const { electionId, votes, voterId } = await request.json();

    // Read current votes
    const fileContent = await fs.readFile(votesPath, 'utf8');
    const data = JSON.parse(fileContent);

    // Initialize election data if it doesn't exist
    if (!data.votes[electionId]) {
      data.votes[electionId] = {};
    }

    // Record votes for each position
    for (const [positionId, selectedCandidates] of Object.entries(votes)) {
      if (!data.votes[electionId][positionId]) {
        data.votes[electionId][positionId] = {};
      }

      // Increment vote count for each selected candidate
      for (const candidateId of selectedCandidates) {
        if (!data.votes[electionId][positionId][candidateId]) {
          data.votes[electionId][positionId][candidateId] = {
            votes: 0,
            lastUpdated: null
          };
        }
        data.votes[electionId][positionId][candidateId].votes++;
        data.votes[electionId][positionId][candidateId].lastUpdated = new Date().toISOString();
      }
    }

    // Update voter status
    if (!data.voterStatus[electionId]) {
      data.voterStatus[electionId] = {
        totalEligibleVoters: 0,
        totalVoted: 0,
        lastUpdated: null
      };
    }
    data.voterStatus[electionId].totalVoted++;
    data.voterStatus[electionId].lastUpdated = new Date().toISOString();

    // Write updated data back to file
    await fs.writeFile(votesPath, JSON.stringify(data, null, 2));

    return Response.json({ message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Error recording vote:', error);
    return Response.json({ error: 'Failed to record vote' }, { status: 500 });
  }
}
