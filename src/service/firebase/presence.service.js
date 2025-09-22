import {
  ref,
  onValue,
  onDisconnect,
  set,
  serverTimestamp,
} from 'firebase/database';
import { doc, updateDoc } from 'firebase/firestore';
import { rtdb, db } from '../../firebase';

class PresenceService {
  constructor() {
    this.uid = null;
  }

  setupPresence(uid) {
    this.uid = uid;

    const isOnlineForFirestore = {
      status: 'online',
      lastSeen: serverTimestamp(),
    };

    const userStatusDatabaseRef = ref(rtdb, '/status/' + uid);

    const isOfflineForDatabase = {
      state: 'offline',
      last_changed: serverTimestamp(),
    };

    const isOnlineForDatabase = {
      state: 'online',
      last_changed: serverTimestamp(),
    };

    const connectedRef = ref(rtdb, '.info/connected');

    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        onDisconnect(userStatusDatabaseRef)
          .set(isOfflineForDatabase)
          .then(() => {
            set(userStatusDatabaseRef, isOnlineForDatabase);

            const userStatusFirestoreRef = doc(db, 'users', uid);
            updateDoc(userStatusFirestoreRef, isOnlineForFirestore);
          });
      }
    });
  }

  goOffline() {
    if (!this.uid) return;

    const userStatusDatabaseRef = ref(rtdb, '/status/' + this.uid);
    const isOfflineForDatabase = {
      state: 'offline',
      last_changed: serverTimestamp(),
    };
    set(userStatusDatabaseRef, isOfflineForDatabase);

    const userStatusFirestoreRef = doc(db, 'users', this.uid);
    const isOfflineForFirestore = {
      status: 'offline',
      lastSeen: serverTimestamp(),
    };
    updateDoc(userStatusFirestoreRef, isOfflineForFirestore);
  }

  // listenToUserStatus(userId, callback) {
  //   const userStatusRef = ref(rtdb, '/status/' + userId);
  //   const unsubscribe = onValue(userStatusRef, (snapshot) => {
  //     const status = snapshot.val();
  //     callback(status);
  //   });
  //   return unsubscribe;
  // }

  listenToMultipleUsers(userIds, callback) {
    if (!userIds || userIds.length === 0) {
      return () => {};
    }

    const unsubscribers = userIds.map((id) => {
      const userStatusRef = ref(rtdb, '/status/' + id);
      return onValue(userStatusRef, (snapshot) => {
        const status = snapshot.val();
        callback(id, status);
      });
    });

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }
}

export const presenceService = new PresenceService();
