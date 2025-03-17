# UniRides 🚗

## Overview
UniRides is a ride-sharing application designed specifically for university students. It allows students to find, join, and create ride groups for various destinations including airports, grocery stores, metro stations, and more. The platform aims to make transportation more accessible, affordable, and sustainable for students.

## Features
- **User Authentication**: Secure sign-up and login with email/password or Google authentication
- **Profile Management**: Users can view and edit their profile information
- **Create Ride Groups**: Create ride groups with details like destination, start point, date, time, and available seats
- **Join Ride Groups**: Browse available ride groups and join them
- **Real-time Chat**: In-group chat functionality for members to communicate
- **Interactive Maps**: Integration with Google Maps to display routes between start points and destinations
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack
- **Frontend**: React, React Router, Bootstrap, Material UI
- **State Management**: React Hooks
- **Backend**: Firebase (Authentication, Firestore, Cloud Functions)
- **Mapping**: Google Maps API
- **Additional Libraries**: 
  - FontAwesome for icons
  - React-Toastify for notifications
  - Framer Motion for animations

## Project Structure
```
unirides/
├── public/                  # Public assets and HTML template
├── src/                     # Source code
│   ├── api/                 # API services
│   ├── assets/              # Assets like images
│   ├── components/          # React components
│   ├── firebase.js          # Firebase configuration
│   ├── App.js               # Main app component
│   ├── index.js             # Entry point
│   └── ...                  # Other utility files
├── dataconnect/             # Firebase Data Connect configuration
├── package.json             # Dependencies and scripts
├── capacitor.config.ts      # Capacitor configuration for mobile
└── README.md                # Project documentation
```

## Key Components
- **Home**: Landing page with information about the service
- **Login**: User authentication screen
- **Cards**: Browse and join available ride groups
- **CreateGroup**: Form to create a new ride group
- **GroupPage**: Detailed view of a group with chat and map
- **Profile**: User profile management
- **MyGroups**: View groups the user has joined
- **LearnMore**: Detailed information about the service

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Google Maps API key

### Environment Variables
Create a `.env` file in the root directory with the following variables:
```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/your-username/unirides.git
   cd unirides
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google provider)
3. Set up Firestore Database with the following collections:
   - `users`: User profiles
   - `groups`: Ride group information
4. Update the Firebase configuration in `src/firebase.js`

## Deployment
The project is configured for deployment with Vercel:

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Deploy:
   ```
   vercel
   ```

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
MIT

## Contact
- Project Link: [https://github.com/your-username/unirides](https://github.com/your-username/unirides)
- Website: [https://unirideshare.com](https://unirideshare.com)
