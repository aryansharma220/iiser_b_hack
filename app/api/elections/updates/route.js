import { headers } from 'next/headers';
import eventEmitter from '@/lib/eventEmitter';

export async function GET() {
  const headersList = headers();
  const response = new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue('data: connected\n\n');
        
        const onUpdate = (data) => {
          controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
        };

        eventEmitter.on('electionUpdate', onUpdate);
        
        // Cleanup
        request.signal.addEventListener('abort', () => {
          eventEmitter.off('electionUpdate', onUpdate);
        });
      }
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    }
  );

  return response;
}
