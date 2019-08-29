import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

import OnlineUser from './OnlineUser';

class OnlineUsersWrapper extends Component {
  constructor(props) {
    super(props);
    this.client = props.client;

    this.state = {
      onlineUsers: [{ name: 'someUser1' }, { name: 'someUser2' }],
    };
  }

  updateLastSeen() {
    // use the apollo client to run a mutation to update the last_seen value
    const UPDATE_LASTSEEN_MUTATION = gql`
      mutation updateLastSeen($now: timestamptz!) {
        update_users(where: {}, _set: { last_seen: $now }) {
          affected_rows
        }
      }
    `;
    this.client.mutate({
      mutation: UPDATE_LASTSEEN_MUTATION,
      variables: { now: new Date().toISOString() },
    });
  }

  componentDidMount() {
    // every 30s, run a mutation to tell the backend that you're online
    this.onlineIndicator = setInterval(() => this.updateLastSeen(), 30000);
  }

  render() {
    const onlineUsersList = [];
    this.state.onlineUsers.forEach((user, index) => {
      onlineUsersList.push(
        <OnlineUser key={index} index={index} user={user} />
      );
    });

    return (
      <div className="onlineUsersWrapper">
        <div className="sliderHeader">
          Online users - {this.state.onlineUsers.length}
        </div>

        {onlineUsersList}
      </div>
    );
  }
}

export default withApollo(OnlineUsersWrapper);
