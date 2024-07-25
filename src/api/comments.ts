// // src/pages/api/comments.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { db } from '../firebase';

// export async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { method } = req;

//   switch (method) {
//     case 'GET':
//       try {
//         const snapshot = await db.collection('comments').get();
//         const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         res.status(200).json(comments);
//       } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch comments' });
//       }
//       break;

//     case 'POST':
//       try {
//         const newComment = req.body;
//         const docRef = await db.collection('comments').add(newComment);
//         const addedComment = { id: docRef.id, ...newComment };
//         res.status(201).json(addedComment);
//       } catch (error) {
//         res.status(500).json({ error: 'Failed to create comment' });
//       }
//       break;

//     case 'PUT':
//       try {
//         const updatedComment = req.body;
//         await db.collection('comments').doc(updatedComment.id).update(updatedComment);
//         res.status(200).json(updatedComment);
//       } catch (error) {
//         res.status(500).json({ error: 'Failed to update comment' });
//       }
//       break;

//     case 'DELETE':
//       try {
//         const { id } = req.body;
//         await db.collection('comments').doc(id).delete();
//         res.status(200).json({ id });
//       } catch (error) {
//         res.status(500).json({ error: 'Failed to delete comment' });
//       }
//       break;

//     default:
//       res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
//       res.status(405).end(`Method ${method} Not Allowed`);
//   }
// }
