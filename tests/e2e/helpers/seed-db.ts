import data from './seed-firestore.json';
import { db, auth } from './admin-firebase';

const BATCH_LIMIT = 500;

function convertPathsToRef(obj: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
            if (typeof value === 'string' && value.startsWith('/')) {
                return [key, db.doc(value)]
            }
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                return [key, convertPathsToRef(value)]
            }
            return [key, value]
        })
    )
}

async function bulkCreate(collectionName: string, dataArray: Array<Record<string, any>>) {
    if (!dataArray.length) return;

    const results = { success: 0, failed: 0 };

    const chunks = [];
    for (let i = 0; i < dataArray.length; i += BATCH_LIMIT) {
        chunks.push(dataArray.slice(i, i + BATCH_LIMIT));
    }

    for (const [_, chunk] of chunks.entries()) {
        try {
            const batch = db.batch();

            chunk.forEach((doc, index) => {
                const docRef = db.collection(collectionName).doc(doc.ref ?? `${collectionName}-${index}`)
                batch.set(docRef, convertPathsToRef({ ...doc.data }))
            })

            await batch.commit();
            results.success += chunk.length;
        } catch (error) {
            results.failed += chunk.length;
        }
    }

    return results;
}

export async function seedDatabase() {

    for (const [key, value] of Object.entries(data)) {
        await bulkCreate(key, value);
    }
}

export async function addUser(userData: { email: string; password: string }) {
    try {
        await auth.createUser(userData);
    } catch { }
}
