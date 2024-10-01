import fs from 'fs';
import path from 'path';

// Not the same in production...
const root = path.join(__dirname, '../../images');

export async function POST(req: Request) {
    const formData = await req.formData();
    
    await fs.promises.mkdir(root, { recursive: true });
    
    for (const key of formData.keys()) {
        if (key.startsWith('photo')) {
            const file = formData.get(key);
            if (file && typeof file === 'object') {
                console.log('file', file.name, file.size);
                const buffer = Buffer.from(await file.arrayBuffer());
                
                await fs.promises.writeFile(path.join(root, file.name ?? 'photo.png'), buffer);
            }
        }
    }
    
    return Response.json({ success: true });
}