import { promises as fs } from 'fs';
import path from 'path';

const electionsPath = path.join(process.cwd(), 'lib', 'elections.json');
const votesPath = path.join(process.cwd(), 'lib', 'votes.json');

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const [electionsContent, votesContent] = await Promise.all([
      fs.readFile(electionsPath, 'utf8'),
      fs.readFile(votesPath, 'utf8')
    ]);

    const elections = JSON.parse(electionsContent);
    const votes = JSON.parse(votesContent);

    const election = elections.active_elections.find(e => e.id === id);
    if (!election) {
      return Response.json({ error: 'Election not found' }, { status: 404 });
    }

    // Get voter statistics
    const voterStats = votes.voterStatus[id] || {
      totalEligibleVoters: 0,
      totalVoted: 0,
      lastUpdated: null
    };

    // Calculate results for each position with detailed statistics
    const results = {
      positions: {},
      statistics: {
        totalVoters: voterStats.totalEligibleVoters,
        totalVoted: voterStats.totalVoted,
        votingPercentage: ((voterStats.totalVoted / voterStats.totalEligibleVoters) * 100).toFixed(1),
        lastUpdated: voterStats.lastUpdated
      }
    };

    election.positions.forEach(position => {
      results.positions[position.id] = {
        candidates: {},
        totalVotes: 0
      };

      position.candidates.forEach(candidate => {
        const candidateVotes = votes.votes[id]?.[position.id]?.[candidate.id] || {
          votes: 0,
          lastUpdated: null
        };

        results.positions[position.id].candidates[candidate.id] = {
          votes: candidateVotes.votes,
          lastUpdated: candidateVotes.lastUpdated,
          name: candidate.name,
          rollNumber: candidate.rollNumber
        };

        results.positions[position.id].totalVotes += candidateVotes.votes;
      });
    });

    return Response.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    return Response.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}
