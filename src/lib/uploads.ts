import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads');

function sanitizeSegment(value: string) {
    return value.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-');
}

export async function savePublicUpload(file: File, folder: string, prefix = 'file') {
    const safeFolder = folder
        .split(/[\\/]+/)
        .filter(Boolean)
        .map(sanitizeSegment)
        .join(path.sep);
    const targetDir = path.join(UPLOAD_ROOT, safeFolder);
    const relativeDir = safeFolder.split(path.sep).join('/');
    const ext = path.extname(file.name);
    const fileName = `${sanitizeSegment(prefix)}-${Date.now()}-${randomUUID()}${ext}`;
    const filePath = path.join(targetDir, fileName);

    await mkdir(targetDir, { recursive: true });
    await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    return `/uploads/${relativeDir}/${fileName}`;
}
