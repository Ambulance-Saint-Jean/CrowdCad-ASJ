import { db } from "@/app/firebase";
import { getCached, setCache } from "@/lib/cache";
import { doc, DocumentData, DocumentReference, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { CULTURE_FALLBACK } from "@/app/constants";


async function resolveRefs(value: unknown): Promise<unknown> {
    if (value instanceof DocumentReference) {
        const snap = await getDoc(value);
        if (!snap.exists()) return null;
        // Recursively resolve refs inside the fetched document too
        return resolveRefs(snap.data());
    }

    if (Array.isArray(value)) {
        return Promise.all(value.map((item) => resolveRefs(item)));
    }

    if (value !== null && typeof value === "object") {
        const entries = await Promise.all(
            Object.entries(value as Record<string, unknown>).map(
                async ([key, val]) => [key, await resolveRefs(val)]
            )
        );
        return Object.fromEntries(entries);
    }

    return value; // primitive, return as-is
}


export default <T extends DocumentData>(collectionName: string, mapper?: (item: DocumentData) => T, useCache: boolean = false): { data: T | null; loading: boolean; error: Error | null } => {
    const [data, setData] = useState<T | null>({} as T);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const getCultureDoc = async (collectionName: string): Promise<void> => {
            try {
                const ref = doc(db, collectionName, navigator.language ?? CULTURE_FALLBACK)

                const cachedData = getCached<T>(ref.path);
                if (useCache && !!cachedData) {
                    setData(cachedData);
                } else {
                    const docSnap = await getDoc(ref);

                    if (!docSnap.exists()) {
                        setData(null);
                    }

                    const docData = await resolveRefs(docSnap.data());
                    const mappedValues = (mapper && docData ? mapper(docData) : docData) as T;

                    setCache(ref.path, mappedValues);
                    setData(mappedValues);
                }
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }
        getCultureDoc(collectionName)
    }, [collectionName]);

    return { data, loading, error };
}
