import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const db = firestore();
export const firebaseAuth = auth();

export const getCurrentUser = () => firebaseAuth.currentUser;

export const addUserPost = async ({ userData, postDetails }: any) => {
  const { uid } = firebaseAuth?.currentUser;
  return db
    .collection('usersData')
    .doc(uid)
    .collection('posts')
    .add({
      title: postDetails.title.trim(),
      description: postDetails.desc.trim(),
      imageURL: postDetails.selectedImage,
      uid: uid,
      likes: [],
      comments: [],
      createdAt: firestore.FieldValue.serverTimestamp(),
      postCreated: {
        fname: userData?.fname?.trim(),
        lname: userData?.lname?.trim(),
        email: userData?.email?.trim(),
        profilePicture: userData?.profilePicture?.trim(),
      },
    });
};
