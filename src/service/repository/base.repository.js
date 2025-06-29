import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';
import {
  ServiceError,
  ErrorCodes,
  withErrorHandler,
} from '../utils/error-handler';
import { formatDocument, formatDocuments } from '../utils/response-formatter';

/**
 * Base repository class for Firestore collections
 */
export class BaseRepository {
  constructor(collectionName) {
    if (!collectionName) {
      throw new Error('Collection name is required');
    }
    this.collectionName = collectionName;
    this.collectionRef = collection(db, collectionName);
  }

  /**
   * Get a document by ID
   */
  findById = withErrorHandler(async (id) => {
    if (!id) {
      throw new ServiceError('ID is required', ErrorCodes.INVALID_INPUT, 400);
    }

    const docRef = doc(this.collectionRef, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new ServiceError(
        `${this.collectionName} not found`,
        ErrorCodes.DOCUMENT_NOT_FOUND,
        404,
      );
    }

    return formatDocument(docSnap);
  });

  /**
   * Get all documents in the collection
   */
  findAll = withErrorHandler(async (options = {}) => {
    const {
      orderByField = 'createdAt',
      orderDirection = 'desc',
      limitCount = 100,
    } = options;

    let q = query(this.collectionRef);

    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const snapshot = await getDocs(q);

    return formatDocuments(snapshot);
  });

  /**
   * Find documents by a specific field
   */
  findByField = withErrorHandler(async (fieldName, value, options = {}) => {
    if (!fieldName || value === undefined) {
      throw new ServiceError(
        'Field name and value are required',
        ErrorCodes.INVALID_INPUT,
        400,
      );
    }

    const { orderByField, orderDirection = 'desc', limitCount } = options;

    let q = query(this.collectionRef, where(fieldName, '==', value));

    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const snapshot = await getDocs(q);
    return formatDocuments(snapshot);
  });

  /**
   * Create a new document
   */
  create = withErrorHandler(async (data) => {
    if (!data || typeof data !== 'object') {
      throw new ServiceError(
        'Invalid data provided',
        ErrorCodes.INVALID_INPUT,
        400,
      );
    }

    const docData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(this.collectionRef, docData);

    // Return the created document
    const newDoc = await getDoc(docRef);
    return formatDocument(newDoc);
  });

  /**
   * Update a document
   */
  update = withErrorHandler(async (id, data) => {
    if (!id) {
      throw new ServiceError('ID is required', ErrorCodes.INVALID_INPUT, 400);
    }

    if (!data || typeof data !== 'object') {
      throw new ServiceError(
        'Invalid data provided',
        ErrorCodes.INVALID_INPUT,
        400,
      );
    }

    const docRef = doc(this.collectionRef, id);

    // Check if document exists
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new ServiceError(
        `${this.collectionName} not found`,
        ErrorCodes.DOCUMENT_NOT_FOUND,
        404,
      );
    }

    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, updateData);

    // Return the updated document
    const updatedDoc = await getDoc(docRef);
    return formatDocument(updatedDoc);
  });

  /**
   * Delete a document
   */
  delete = withErrorHandler(async (id) => {
    if (!id) {
      throw new ServiceError('ID is required', ErrorCodes.INVALID_INPUT, 400);
    }

    const docRef = doc(this.collectionRef, id);

    // Check if document exists
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new ServiceError(
        `${this.collectionName} not found`,
        ErrorCodes.DOCUMENT_NOT_FOUND,
        404,
      );
    }

    await deleteDoc(docRef);
    return { id, deleted: true };
  });

  /**
   * Check if a document exists
   */
  exists = withErrorHandler(async (id) => {
    if (!id) {
      throw new ServiceError('ID is required', ErrorCodes.INVALID_INPUT, 400);
    }

    const docRef = doc(this.collectionRef, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  });
}
