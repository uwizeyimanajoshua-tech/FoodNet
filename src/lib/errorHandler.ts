import { toast } from "react-hot-toast";
import { auth } from "./firebase";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: any, operationType: OperationType, path: string | null, customMessage?: string) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  console.error("Firestore Error:", JSON.stringify(errInfo));
  
  let message = customMessage || "An error occurred with the database.";
  if (error.code === "permission-denied") {
    message = "You don't have permission to perform this action.";
  } else if (error.code === "unauthenticated") {
    message = "Please sign in to continue.";
  }

  toast.error(message, { id: "firestore-error" });
  
  // Re-throw to allow component-level handling if needed
  // throw new Error(JSON.stringify(errInfo)); 
  // actually the skill says "MUST throw a new error with a very specific JSON object"
  throw new Error(JSON.stringify(errInfo));
}
