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
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
