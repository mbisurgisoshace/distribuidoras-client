import * as React from 'react';
import { Redirect } from 'react-router-dom';

import * as styles from './styles.css';
import AuthService, { AuthResponse } from '../services/auth';
import { Input } from '../shared/components/Input';
import { Button } from '../shared/components/Button';

interface State {
	username: string;
	password: string;
	isAuthed: boolean;
}

export class Login extends React.Component<null, State> {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			isAuthed: false
		};
	}

	handleSubmit = async () => {
		const auth = await AuthService.login(this.state.username, this.state.password);

		if (auth.status === 'success') {
			this.setState({
				isAuthed: true
			});
		}

		return;
	};

	render() {
		const { username, password, isAuthed } = this.state;

		if (isAuthed) {
			return <Redirect to="/" />;
		}

		return (
			<div className={styles.Login}>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						this.handleSubmit();
					}}
					className={styles.LoginForm}
				>
					<Input
						id="username"
						size='small'
						name="username"
						placeholder="Username"
						value={username}
						onChange={(e) => this.setState({ username: e.target.value })}
					/>
					<Input
						id="password"
						size='small'
						name="password"
						placeholder="Password"
						value={password}
						type='password'
						onChange={(e) => this.setState({ password: e.target.value })}
					/>

					<div className={styles.ButtonContainer}>
						<Button buttonType="submit" size="small">
							Login
						</Button>
					</div>
					{/* <button type="submit">Login</button> */}
				</form>
			</div>
		);
	}
}
