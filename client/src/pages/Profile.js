import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import Auth from '../utils/auth';
import { ADD_FRIEND } from '../utils/mutations';
import ThoughtForm from '../components/ThoughtForm';



const Profile = (props) => {

const [addFriend] = useMutation(ADD_FRIEND);
  const { username: userParam } = useParams();


    /* 
        Now if there's a value in userParam that we got from the URL bar, 
        we'll use that value to run the QUERY_USER query. If there's no value in userParam, 
        like if we simply visit /profile as a logged-in user, we'll execute the QUERY_ME query instead.
    */
  const { loading, data } = useQuery( userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });
  
  /* 
    Remember, when we run QUERY_ME, the response will return with our data in the me property; 
    but if it runs QUERY_USER instead, the response will return with our data in the user property. 
  
  */

  const user = data?.me || data?.user || {};
  // navigate to personal profile page if username is the logged-in user's
  /* 
    With this, we're checking to see if the user is logged in and if so, if the username stored 
    in the JSON Web Token is the same as the userParam value. If they match, we return the <Navigate> 
    component with the prop to set to the value /profile, which will redirect the user away from this URL 
    and to the /profile route.
  */
  if(Auth.loggedIn() && Auth.getProfile().data.username === useParams) {
      return <Navigate to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  
  const handleClick = async () => {
      try{
          await addFriend({
              variables: { id: user._id}
          });
      } catch(e) {
          console.error(e);
      }
  }
  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {user.username}'s profile.
        </h2>
        {userParam && (
              <buton className="btn ml-auto" onClick={handleClick}>
              Add Friend
          </buton>
        )}
      
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList
            thoughts={user.thoughts}
            title={`${user.username}'s thoughts...`}
          />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
      <div className='mb-3'>{!userParam && <ThoughtForm />}</div>
    </div>
  );
};

export default Profile;
