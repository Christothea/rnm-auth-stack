import React from 'react';
import { Card } from 'react-bootstrap';
import { Redirect } from 'react-router';
import { UserProfileContext } from '../../context/user-profile.context';
import { UserProfile } from '../../models/user-profile.model';

export default class Home extends React.Component {

    constructor(props: any) {
        super(props);
        this.handleLogout.bind(this);
    }

    handleLogout(userProfile: UserProfile): void {
        userProfile.userStateChanged(new UserProfile());
    }

    homePageContent() {
         
    }

    render() {
        return (
            <UserProfileContext.Consumer>
                {(userProfile: UserProfile) => (
                    userProfile.isLoggedIn ?
                        <div className="container" style={{ display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'  }}>
                            <Card style={{ width: '30rem' }}>
                                <Card.Body>
                                    <Card.Title><h1>Hello,</h1></Card.Title>
                                    <Card.Text>
                                        Welcome <strong>{userProfile.info.fullName}</strong>!
                                        To logout click <button type="button" className="btn btn-primary" onClick={() => this.handleLogout(userProfile)}>here</button>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                        : <Redirect to="/login" />
                )}
            </UserProfileContext.Consumer>
        );
    }
}