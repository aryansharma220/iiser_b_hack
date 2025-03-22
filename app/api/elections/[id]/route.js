import { promises as fs } from 'fs';
import path from 'path';

const electionsPath = path.join(process.cwd(), 'lib', 'elections.json');

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const fileContent = await fs.readFile(electionsPath, 'utf8');
    const data = JSON.parse(fileContent);
    
    const index = data.active_elections.findIndex(e => e.id === id);
    if (index === -1) {
      return Response.json({ error: 'Election not found' }, { status: 404 });
    }

    data.active_elections.splice(index, 1);
    await fs.writeFile(electionsPath, JSON.stringify(data, null, 2));
    
    return Response.json({ message: 'Election deleted successfully' });
  } catch (error) {
    return Response.json({ error: 'Failed to delete election' }, { status: 500 });
  }
}
