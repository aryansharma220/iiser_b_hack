import { promises as fs } from 'fs';
import path from 'path';

const electionsPath = path.join(process.cwd(), 'lib', 'elections.json');

export async function GET() {
  try {
    const fileContent = await fs.readFile(electionsPath, 'utf8');
    return Response.json(JSON.parse(fileContent));
  } catch (error) {
    return Response.json({ error: 'Failed to load elections' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const fileContent = await fs.readFile(electionsPath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Generate a unique ID
    const newId = `election_${Date.now()}`;
    const newElection = {
      id: newId,
      ...body,
      status: 'active'
    };

    data.active_elections.push(newElection);
    await fs.writeFile(electionsPath, JSON.stringify(data, null, 2));
    
    return Response.json(newElection);
  } catch (error) {
    return Response.json({ error: 'Failed to create election' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const fileContent = await fs.readFile(electionsPath, 'utf8');
    const data = JSON.parse(fileContent);
    
    const index = data.active_elections.findIndex(e => e.id === body.id);
    if (index === -1) {
      return Response.json({ error: 'Election not found' }, { status: 404 });
    }

    data.active_elections[index] = { ...data.active_elections[index], ...body };
    await fs.writeFile(electionsPath, JSON.stringify(data, null, 2));
    
    return Response.json(data.active_elections[index]);
  } catch (error) {
    return Response.json({ error: 'Failed to update election' }, { status: 500 });
  }
}
