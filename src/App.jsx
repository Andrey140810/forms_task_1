import { useState, useRef } from 'react'
import styles from './App.module.css'

export function App() {
	const [email, setEmail] = useState('')
	const [emailError, setEmailerror] = useState(null)
	const [password, setPassword] = useState('')
	const [passwordError, setPasswordError] = useState(null)
	const [repeatPassword, setRepeatPassword] = useState('')
	const [repeatPasswordError, setRepeatPasswordError] = useState(null)

	const submitButtonRef = useRef(null)

	const onEmailChange = ({ target }) => {
		setEmail(target.value)

		if (emailError) {
			setEmailerror(null)
		}
	}

	const onEmailBlur = ({ target }) => {
		if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(target.value)) {
			setEmailerror('Неверный email. Проверьте ваш email на соответствие RFC 5322')
		} else {
			setEmailerror(null)
		}
	}

	const onPasswordChange = ({ target }) => {
		setPassword(target.value)

		if (passwordError) {
			setPasswordError(null)
		}
	}

	const onPasswordBlur = ({ target }) => {

		let newError = null

		 if (!/(?=.*[a-z])(?=.*[A-Z])/.test(target.value)) {
			newError = 'Некорректный пароль. Пароль должен содержать хотя бы 1 строчную и 1 заглавную букву'
		} else if (!/(?=.*\d)(?=.*[!@#$%^&*])/.test(target.value)) {
			newError = 'Некорректный пароль. Пароль должен содержать хотя бы 1 цифру и символ !@#$%^&*'
		} else if (target.value.length < 8) {
			newError = 'Некорректный пароль. Пароль должен быть не менее 8 символов'
		}

		setPasswordError(newError)

		if (target.value !== '' && repeatPassword !== '') {
			if (target.value !== repeatPassword) {
				setRepeatPasswordError('Некорректный повтор пароля. Пароли должны совпадать')
			} else {
				setRepeatPasswordError(null)
			}
		}
	}

	const onRepeadPasswordChange = ({ target }) => {
		setRepeatPassword(target.value)

		if (repeatPasswordError) {
			setRepeatPasswordError(null)
		}
		if (target.value === password && email !== '' & password !== '') {
			submitButtonRef.current.focus()
		}
	}

	const onRepeadPasswordBlur = ({ target }) => {
		if (password !== '' && target.value !== '') {
			if (password !== target.value) {
				setRepeatPasswordError('Некорректный повтор пароля. Пароли должны совпадать')
			} else {
				setRepeatPasswordError(null)
			}
		}

		if (isFormvalid) {
			submitButtonRef.current.focus()
		}
	}

	const onSubmit = (event) => {
		event.preventDefault()
		console.log(email, password, repeatPassword)
	}

	const isFormvalid = emailError === null && passwordError === null && repeatPasswordError === null

  return (
    <div className={styles.app}>
		<form className={styles.formLabel} onSubmit={onSubmit}>Новый пользователь
			{emailError && <div className={styles.errorLabel}>{emailError}</div>}
			{passwordError && <div className={styles.errorLabel}>{passwordError}</div>}
			{repeatPasswordError && <div className={styles.errorLabel}>{repeatPasswordError}</div>}
			<input name='email' type="text" value={email} placeholder='Email' onChange={onEmailChange} onBlur={onEmailBlur} />
			<input name='password' type="password" placeholder='Пароль' onChange={onPasswordChange} onBlur={onPasswordBlur} />
			<input name='repeadPassword' type="password" placeholder='Повторите пароль' onChange={(onRepeadPasswordChange)} onBlur={onRepeadPasswordBlur} />
			<button ref={submitButtonRef} type='submit' disabled={!isFormvalid}>Зарегистрироваться</button>
		</form>
	</div>
  )
}
