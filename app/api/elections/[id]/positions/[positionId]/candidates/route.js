import { promises as fs } from 'fs';
import path from 'path';
import eventEmitter from '@/lib/eventEmitter';

const electionsPath = path.join(process.cwd(), 'lib', 'elections.json');

export async function POST(request, { params }) {
  try {
    const { id, positionId } = params;
    const candidateData = await request.json();
    const fileContent = await fs.readFile(electionsPath, 'utf8');
    const data = JSON.parse(fileContent);

    const electionIndex = data.active_elections.findIndex(e => e.id === id);
    if (electionIndex === -1) return Response.json({ error: 'Election not found' }, { status: 404 });

    const positionIndex = data.active_elections[electionIndex].positions.findIndex(p => p.id === positionId);
    if (positionIndex === -1) return Response.json({ error: 'Position not found' }, { status: 404 });

    const newCandidate = {
      id: `cand_${Date.now()}`,
      ...candidateData
    };

    data.active_elections[electionIndex].positions[positionIndex].candidates.push(newCandidate);
    await fs.writeFile(electionsPath, JSON.stringify(data, null, 2));

    // Emit event after successful addition
    eventEmitter.emit('electionUpdate', {
      type: 'candidateAdded',
      electionId: id,
      positionId,
      candidate: newCandidate
    });

    return Response.json(newCandidate);
  } catch (error) {
    return Response.json({ error: 'Failed to add candidate' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id, positionId, candidateId } = params;
    const fileContent = await fs.readFile(electionsPath, 'utf8');
    const data = JSON.parse(fileContent);

    const election = data.active_elections.find(e => e.id === id);
    if (!election) return Response.json({ error: 'Election not found' }, { status: 404 });

    const position = election.positions.find(p => p.id === positionId);
    if (!position) return Response.json({ error: 'Position not found' }, { status: 404 });

    position.candidates = position.candidates.filter(c => c.id !== candidateId);
    await fs.writeFile(electionsPath, JSON.stringify(data, null, 2));

    // Emit event after successful deletion
    eventEmitter.emit('electionUpdate', {
      type: 'candidateRemoved',
      electionId: id,
      positionId,
      candidateId
    });

    return Response.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    return Response.json({ error: 'Failed to delete candidate' }, { status: 500 });
  }
}
