// src/api/firebase.js
import { collection, getDocs, updateDoc, doc, arrayUnion, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export const fetchGroups = async (appliedFilter) => {
  const groups = collection(db, 'groups');
  let q = groups;
  if (appliedFilter.length > 0) {
    q = query(groups, where('groupType', 'in', appliedFilter));
  }
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();

    // Convert the 'date' field to a formatted date string
    if (data.date && typeof data.date.toDate === 'function') {
      data.date = data.date.toDate();
    } else {
      data.date = 'Unknown';
    }

    return { id: doc.id, ...data };
  });
};

export const updateGroup = async (groupId, data) => {
  const groupDoc = doc(db, 'groups', groupId);
  await updateDoc(groupDoc, data);
};

export const joinGroup = async (groupId, userName) => {
  const groupDoc = doc(db, 'groups', groupId);
  await updateDoc(groupDoc, {
    ridees: arrayUnion(userName),
    seatsAvailable: arrayUnion(userName),
  });
};
