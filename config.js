/*
  El Dorado — Room Progress board — cloud configuration
  ---------------------------------------------------------------
  Connects to the RG & Sons Firebase project (rgsons-37f42), the
  same one the Proposal Writer / field apps use. This board keeps
  its data in its OWN collections so it never touches tickets:

    - eldorado_config   (one "main" doc: job info + task template)
    - eldorado_rooms    (one doc per room: progress, notes, photos, schedule)
    - Storage path: eldorado/<roomId>/<photo>

  Firebase web keys are meant to live in client code. Protect the
  project with the Firestore + Storage security rules shipped in
  firestore.rules / storage.rules (see README).

  The room QR codes deep-link to  <this app URL>/?room=<roomId>  so
  scanning a label opens that room's board on any phone.
*/
window.ED_CONFIG = {
  firebase: {
    apiKey: "AIzaSyDK2kWzARIpQmJOQnLDz6zjt5HL7rIk4is",
    authDomain: "rgsons-37f42.firebaseapp.com",
    projectId: "rgsons-37f42",
    storageBucket: "rgsons-37f42.firebasestorage.app",
    messagingSenderId: "773523362705",
    appId: "1:773523362705:web:d823f7e2486604af104030"
  },
  // Firestore collections + doc used by this board
  configCollection: "eldorado_config",
  configDoc: "main",
  // Projects: each doc holds one project's config (name, area labels, task
  // template, admin). Rooms/users/log rows carry a projectId to scope them.
  projectsCollection: "eldorado_projects",
  roomsCollection: "eldorado_rooms",
  // Users (field workers) who request access + get approved by the office
  usersCollection: "eldorado_users",
  // Append-only activity log (who did what, when)
  logCollection: "eldorado_log",
  // Material requests (plumbers request, office fulfills)
  materialsCollection: "eldorado_materials",
  // Firebase Storage folder for room photos
  storageFolder: "eldorado",
  // Job label shown until you set one in Config
  defaultJobName: "El Dorado Hospital"
};
